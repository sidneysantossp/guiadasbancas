#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import puppeteer from "puppeteer";

const DEFAULT_BASE_URL = "http://localhost:3000";
const DEFAULT_QUERY = "energetico";

function env(name, fallback = "") {
  return String(process.env[name] ?? fallback).trim();
}

function envBool(name, fallback = false) {
  const value = env(name);
  if (!value) return fallback;
  return ["1", "true", "yes", "sim", "on"].includes(value.toLowerCase());
}

function toSlug(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function nowId() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate()),
    "-",
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds()),
  ].join("");
}

const config = {
  baseUrl: env("SMOKE_BASE_URL", DEFAULT_BASE_URL).replace(/\/$/, ""),
  productQuery: env("SMOKE_PRODUCT_QUERY", DEFAULT_QUERY),
  productUrl: env("SMOKE_PRODUCT_URL"),
  headless: !["0", "false", "no", "nao"].includes(env("SMOKE_HEADLESS", "true").toLowerCase()),
  authMode: env("SMOKE_AUTH_MODE", "none").toLowerCase(),
  clientEmail: env("SMOKE_CLIENT_EMAIL"),
  clientPassword: env("SMOKE_CLIENT_PASSWORD"),
  clientName: env("SMOKE_CLIENT_NAME", "Cliente Smoke Guia das Bancas"),
  clientPhone: env("SMOKE_CLIENT_PHONE", "(11) 99999-9999"),
  createOrder: envBool("SMOKE_CREATE_ORDER", false),
  shippingMode: env("SMOKE_SHIPPING_MODE", "retirada").toLowerCase(),
  paymentMethod: env("SMOKE_PAYMENT_METHOD", "pix").toLowerCase(),
  outputRoot: path.resolve(env("SMOKE_OUTPUT_DIR", "output/smoke")),
  jornaleiroEmail: env("SMOKE_JORNALEIRO_EMAIL"),
  jornaleiroPassword: env("SMOKE_JORNALEIRO_PASSWORD"),
  advanceJornaleiroStatus: envBool("SMOKE_ADVANCE_JORNALEIRO_STATUS", false),
  address: {
    cep: env("SMOKE_ADDRESS_CEP"),
    street: env("SMOKE_ADDRESS_STREET"),
    number: env("SMOKE_ADDRESS_NUMBER"),
    neighborhood: env("SMOKE_ADDRESS_NEIGHBORHOOD"),
    city: env("SMOKE_ADDRESS_CITY"),
    uf: env("SMOKE_ADDRESS_UF"),
    complement: env("SMOKE_ADDRESS_COMPLEMENT"),
  },
};

if (!["none", "login", "register"].includes(config.authMode)) {
  console.error(`SMOKE_AUTH_MODE inválido: ${config.authMode}. Use none, login ou register.`);
  process.exit(1);
}

if (config.authMode === "register" && !config.clientEmail) {
  config.clientEmail = `smoke.${Date.now()}@example.com`;
}

if ((config.authMode === "login" || config.authMode === "register") && !config.clientPassword) {
  console.error("SMOKE_CLIENT_PASSWORD é obrigatório quando SMOKE_AUTH_MODE=login ou register.");
  process.exit(1);
}

if (config.createOrder && !["pix", "cash"].includes(config.paymentMethod)) {
  console.error(`SMOKE_PAYMENT_METHOD inválido: ${config.paymentMethod}. Use pix ou cash.`);
  process.exit(1);
}

if (config.shippingMode !== "retirada" && config.createOrder) {
  const requiredAddress = ["cep", "number"];
  const missing = requiredAddress.filter((field) => !config.address[field]);
  if (missing.length > 0) {
    console.error(`Campos obrigatórios ausentes para entrega: ${missing.join(", ")}`);
    process.exit(1);
  }
}

const runId = nowId();
const outputDir = path.join(outputRootSafe(config.outputRoot), runId);

function outputRootSafe(value) {
  return path.resolve(value || "output/smoke");
}

function isLikelyProductHrefValue(href) {
  if (!href) return false;
  if (href.startsWith("http")) return true;
  if (href.startsWith("/produto/")) return true;

  const segments = href.split("?")[0].split("#")[0].split("/").filter(Boolean);
  if (segments.length < 2) return false;
  if (segments[0] === "banca") return false;
  if (["buscar", "categorias", "jornaleiro", "admin", "distribuidor"].includes(segments[0])) return false;
  return true;
}

const summary = {
  runId,
  startedAt: new Date().toISOString(),
  config: {
    baseUrl: config.baseUrl,
    productQuery: config.productQuery,
    productUrl: config.productUrl || null,
    headless: config.headless,
    authMode: config.authMode,
    createOrder: config.createOrder,
    shippingMode: config.shippingMode,
    paymentMethod: config.paymentMethod,
    hasClientEmail: Boolean(config.clientEmail),
    hasClientPassword: Boolean(config.clientPassword),
    hasJornaleiroCreds: Boolean(config.jornaleiroEmail && config.jornaleiroPassword),
    advanceJornaleiroStatus: config.advanceJornaleiroStatus,
  },
  steps: [],
  artifacts: [],
  requests: [],
  consoleErrors: [],
  warnings: [],
  product: null,
  cart: null,
  order: null,
  jornaleiro: null,
  outcome: "running",
};

let browser;

function pushStep(name, status, details = {}) {
  const entry = {
    name,
    status,
    at: new Date().toISOString(),
    ...(details.message ? { message: details.message } : {}),
    details: Object.fromEntries(
      Object.entries(details).filter(([key]) => key !== "message"),
    ),
  };
  summary.steps.push(entry);
  const label = status === "ok" ? "OK" : status === "skip" ? "SKIP" : status === "fail" ? "FAIL" : "INFO";
  console.log(`[${label}] ${name}${details.message ? ` - ${details.message}` : ""}`);
}

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

async function writeJson(name, data) {
  const target = path.join(outputDir, name);
  await fs.writeFile(target, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  summary.artifacts.push(target);
  return target;
}

async function saveScreenshot(page, name) {
  const target = path.join(outputDir, `${toSlug(name) || "screenshot"}.png`);
  await page.screenshot({ path: target, fullPage: true });
  summary.artifacts.push(target);
  return target;
}

function attachPageObservers(page, label) {
  page.on("console", (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (type === "error") {
      summary.consoleErrors.push({ page: label, text });
    } else if (type === "warning" || type === "warn") {
      summary.warnings.push({ page: label, text });
    }
  });

  page.on("pageerror", (err) => {
    summary.consoleErrors.push({ page: label, text: err.message });
  });

  page.on("response", async (response) => {
    const url = response.url();
    if (
      !url.includes("/api/orders") &&
      !url.includes("/api/whatsapp/status-update") &&
      !url.includes("/api/whatsapp/jornaleiro-notification")
    ) {
      return;
    }

    const entry = {
      page: label,
      url,
      method: response.request().method(),
      status: response.status(),
      ok: response.ok(),
      at: new Date().toISOString(),
      body: null,
    };

    try {
      const contentType = response.headers()["content-type"] || "";
      if (contentType.includes("application/json")) {
        entry.body = await response.json();
      } else {
        entry.body = await response.text();
      }
    } catch (error) {
      entry.body = `[unreadable response body: ${error.message}]`;
    }

    summary.requests.push(entry);
  });
}

async function goto(page, url, waitUntil = "networkidle2") {
  await page.goto(url, { waitUntil, timeout: 60000 });
  await page.waitForSelector("body", { timeout: 15000 });
}

async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function getText(page) {
  return page.evaluate(() => document.body?.innerText || "");
}

async function dismissOptionalUi(page) {
  const actions = [
    { selector: "button", texts: ["Entendi", "Aceitar", "Rejeitar", "Fechar"] },
  ];

  for (const action of actions) {
    for (const text of action.texts) {
      try {
        const clicked = await page.evaluate(
          ({ selector, label }) => {
            const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
            const elements = Array.from(document.querySelectorAll(selector));
            const target = elements.find((element) => {
              const el = element;
              const style = window.getComputedStyle(el);
              const visible =
                style.display !== "none" &&
                style.visibility !== "hidden" &&
                el.getBoundingClientRect().width > 0 &&
                el.getBoundingClientRect().height > 0;
              return visible && normalize(el.textContent) === normalize(label);
            });
            if (target) {
              target.click();
              return true;
            }
            return false;
          },
          { selector: action.selector, label: text },
        );
        if (clicked) {
          await wait(500);
        }
      } catch {}
    }
  }
}

async function clickButtonByText(page, texts) {
  const labels = Array.isArray(texts) ? texts : [texts];
  const clicked = await page.evaluate((buttonTexts) => {
    const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
    const isVisible = (element) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const candidates = Array.from(document.querySelectorAll("button, a"));
    for (const wanted of buttonTexts.map(normalize)) {
      const target = candidates.find((element) => isVisible(element) && normalize(element.textContent).includes(wanted));
      if (target) {
        target.click();
        return true;
      }
    }
    return false;
  }, labels);

  if (!clicked) {
    throw new Error(`Não encontrei botão/link com texto: ${labels.join(", ")}`);
  }
}

async function typeIn(page, selector, value) {
  await page.waitForSelector(selector, { timeout: 15000 });
  await page.click(selector, { clickCount: 3 });
  await page.type(selector, value, { delay: 20 });
}

async function waitForSearchResults(page) {
  await page.waitForFunction(
    () => {
      const bodyText = document.body?.innerText || "";
      const loading = bodyText.includes("Carregando...");
      const hasProductButton = Array.from(document.querySelectorAll("button")).some((button) =>
        String(button.textContent || "").toLowerCase().includes("adicionar ao carrinho"),
      );
      const hasEmptyState =
        bodyText.includes("Nenhum produto encontrado") ||
        bodyText.includes("Nenhum resultado encontrado");
      return !loading && (hasProductButton || hasEmptyState);
    },
    { timeout: 45000 },
  );
  await wait(1000);
}

async function getFirstProduct(page) {
  return page.evaluate(() => {
    const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
    const buttons = Array.from(document.querySelectorAll("button"));
    const addButtons = buttons.filter((button) =>
      normalize(button.textContent).toLowerCase() === "adicionar ao carrinho",
    );

    for (const addButton of addButtons) {
      const contentNode = addButton.parentElement;
      const directLink = contentNode?.querySelector("a[href]");
      const href = directLink?.getAttribute("href") || "";

      return {
        href,
        name: normalize(directLink?.textContent || "Produto"),
      };
    }

    return null;
  });
}

async function ensureCheckoutLoaded(page) {
  await page.waitForFunction(
    () => {
      const bodyText = document.body?.innerText || "";
      return bodyText.includes("Checkout") || bodyText.includes("Para finalizar sua compra");
    },
    { timeout: 30000 },
  );
}

async function addFirstProductFromSearch(page) {
  let added = false;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    await clickButtonByText(page, "Adicionar ao carrinho");
    await wait(2500);

    if (await hasCartState(page)) {
      added = true;
      break;
    }

    await wait(1000);
  }

  if (!added) {
    await waitForCartState(page);
  }

  pushStep("Produto adicionado ao carrinho direto da busca", "ok");
}

async function hasCartState(page) {
  return page.evaluate(() => {
    try {
      const raw = window.localStorage.getItem("gb:cart");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.some((item) => Number(item?.qty || 0) > 0)) {
          return true;
        }
      }
    } catch {}

    const text = document.body?.innerText || "";
    if (text.includes("Adicionado ao carrinho")) {
      return true;
    }

    return Array.from(document.querySelectorAll("button, a, span")).some((node) => {
      const content = String(node.textContent || "").replace(/\s+/g, " ").trim();
      return /^1\s*(Sua)?\s*(Sacola|Carrinho)$/i.test(content) || /^Itens:\s*[1-9]/i.test(content);
    });
  });
}

async function waitForCartState(page) {
  await page.waitForFunction(async () => {
    try {
      const raw = window.localStorage.getItem("gb:cart");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.some((item) => Number(item?.qty || 0) > 0)) {
          return true;
        }
      }
    } catch {}

    const text = document.body?.innerText || "";
    if (text.includes("Adicionado ao carrinho")) {
      return true;
    }

    return Array.from(document.querySelectorAll("button, a, span")).some((node) => {
      const content = String(node.textContent || "").replace(/\s+/g, " ").trim();
      return /^1\s*(Sua)?\s*(Sacola|Carrinho)$/i.test(content) || /^Itens:\s*[1-9]/i.test(content);
    });
  }, { timeout: 15000 });
}

async function isAuthGateVisible(page) {
  const text = await getText(page);
  return text.includes("Para finalizar sua compra, você precisa fazer login") || text.includes("Criar Conta");
}

async function registerCustomer(page) {
  pushStep("Abrir cadastro do cliente", "info");
  await goto(page, `${config.baseUrl}/registrar/cliente?redirect=/checkout`);
  await dismissOptionalUi(page);
  await typeIn(page, "#fullName", config.clientName);
  await typeIn(page, "#email", config.clientEmail);
  await typeIn(page, "#password", config.clientPassword);
  await typeIn(page, "#confirmPassword", config.clientPassword);
  await clickButtonByText(page, "Criar Conta");
  await page.waitForFunction(() => window.location.pathname.includes("/entrar/cliente"), { timeout: 30000 });
  pushStep("Cadastro do cliente concluído", "ok", { email: config.clientEmail });
}

async function loginCustomer(page) {
  pushStep("Abrir login do cliente", "info");
  await goto(page, `${config.baseUrl}/entrar/cliente?redirect=/checkout`);
  await dismissOptionalUi(page);
  await typeIn(page, "#email", config.clientEmail);
  await typeIn(page, "#password", config.clientPassword);
  await clickButtonByText(page, ["Entrar"]);
  await page.waitForFunction(() => window.location.pathname.includes("/checkout"), { timeout: 30000 });
  await ensureCheckoutLoaded(page);
  pushStep("Login do cliente concluído", "ok", { email: config.clientEmail });
}

async function ensureCustomerPhone(page) {
  await page.waitForFunction(
    () => {
      const text = document.body?.innerText || "";
      return text.includes("Seus dados") && text.includes("Telefone");
    },
    { timeout: 30000 },
  );
  await wait(1500);

  const needsPhone = await page.evaluate(() => {
    const text = document.body?.innerText || "";
    return text.includes("Não informado") || text.includes("Adicionar *");
  });

  if (!needsPhone) {
    pushStep("Telefone do cliente já disponível", "ok");
    return;
  }

  await clickButtonByText(page, ["Adicionar *", "Editar"]);
  await typeIn(page, 'input[placeholder="(XX) XXXXX-XXXX"]', config.clientPhone);
  await clickButtonByText(page, "Salvar");
  await page.waitForFunction(
    (expectedPhone) => {
      const text = document.body?.innerText || "";
      return text.includes(expectedPhone) && !text.includes("Não informado");
    },
    { timeout: 15000 },
    config.clientPhone,
  );
  pushStep("Telefone do cliente atualizado", "ok", { phone: config.clientPhone });
}

async function ensureShippingMode(page) {
  if (config.shippingMode === "retirada") {
    pushStep("Modo de entrega mantido em retirada", "ok");
    return;
  }

  await typeIn(page, 'input[placeholder="CEP (00000-000)"]', config.address.cep);
  await page.waitForSelector('input[placeholder="Número"]', { timeout: 30000 });
  await typeIn(page, 'input[placeholder="Número"]', config.address.number);

  if (config.address.complement) {
    await typeIn(page, 'input[placeholder="Complemento (opcional)"]', config.address.complement);
  }

  await clickButtonByText(page, "Salvar como principal");
  await wait(1200);
  await clickButtonByText(page, "Calcular frete");
  await page.waitForFunction(
    () => {
      const labels = Array.from(document.querySelectorAll("label"));
      return labels.some((label) => {
        const text = String(label.textContent || "");
        return text.includes("SEDEX") || text.includes("Motoboy Uber Eats");
      });
    },
    { timeout: 30000 },
  );

  const selected = await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll("label"));
    const target = labels.find((label) => {
      const text = String(label.textContent || "");
      return text.includes("SEDEX") || text.includes("Motoboy Uber Eats");
    });
    if (!target) return null;
    target.click();
    return String(target.textContent || "").replace(/\s+/g, " ").trim();
  });

  if (!selected) {
    throw new Error("Não encontrei opção de entrega diferente de retirada");
  }

  pushStep("Modo de entrega configurado", "ok", { option: selected });
}

async function ensurePaymentMethod(page) {
  if (config.paymentMethod === "pix") {
    pushStep("Pagamento mantido em PIX", "ok");
    return;
  }

  const clicked = await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll("label"));
    const target = labels.find((label) => String(label.textContent || "").includes("Pagar na Retirada"));
    if (!target) return false;
    target.click();
    return true;
  });

  if (!clicked) {
    throw new Error("Não encontrei a opção de pagamento em dinheiro/retirada");
  }

  pushStep("Pagamento configurado", "ok", { paymentMethod: config.paymentMethod });
}

async function extractOrderFromRequests() {
  const request = [...summary.requests]
    .reverse()
    .find((entry) => entry.url.includes("/api/orders") && entry.method === "POST" && entry.ok && entry.body?.ok);

  if (!request) return null;

  return {
    orderId: request.body.orderId || null,
    orderNumber: request.body.orderNumber || null,
    response: request.body,
  };
}

async function runCustomerFlow(page) {
  pushStep("Abrir home", "info");
  await goto(page, `${config.baseUrl}/`);
  await dismissOptionalUi(page);
  await saveScreenshot(page, "01-home");
  pushStep("Home carregada", "ok");

  const searchUrl = config.productUrl || `${config.baseUrl}/buscar?q=${encodeURIComponent(config.productQuery)}`;
  pushStep("Abrir busca", "info", { url: searchUrl });
  await goto(page, searchUrl);
  await dismissOptionalUi(page);
  await waitForSearchResults(page);
  await saveScreenshot(page, "02-busca");

  const searchText = await getText(page);
  if (searchText.includes("Nenhum produto encontrado")) {
    throw new Error(`Busca sem resultados para "${config.productQuery}"`);
  }

  const product = await getFirstProduct(page);
  if (!product?.href) {
    throw new Error("Não consegui localizar o primeiro produto da busca");
  }

  summary.product = product;
  pushStep("Primeiro produto identificado", "ok", product);

  if (isLikelyProductHrefValue(product.href)) {
    const productUrl = product.href.startsWith("http") ? product.href : `${config.baseUrl}${product.href}`;
    try {
      await goto(page, productUrl);
      await dismissOptionalUi(page);
      await page.waitForFunction(
        () => Array.from(document.querySelectorAll("button")).some((button) =>
          String(button.textContent || "").toLowerCase().includes("adicionar ao carrinho"),
        ),
        { timeout: 15000 },
      );
      await saveScreenshot(page, "03-produto");
      pushStep("Página do produto carregada", "ok", { url: productUrl });

      await clickButtonByText(page, "Adicionar ao carrinho");
      await waitForCartState(page);
      pushStep("Produto adicionado ao carrinho", "ok");
    } catch (error) {
      pushStep("Fallback para busca", "skip", { message: `PDP instável: ${error.message}` });
      await goto(page, searchUrl);
      await dismissOptionalUi(page);
      await waitForSearchResults(page);
      await addFirstProductFromSearch(page);
    }
  } else {
    pushStep("Fallback para busca", "skip", { message: `Href do card não é PDP canônica: ${product.href}` });
    await addFirstProductFromSearch(page);
  }

  await goto(page, `${config.baseUrl}/carrinho`);
  await dismissOptionalUi(page);
  await page.waitForFunction(
    () => {
      const text = document.body?.innerText || "";
      const hasHeading = text.includes("Seu Carrinho");
      const isEmpty = text.includes("Seu carrinho está vazio.");
      const hasItemCount = /Itens:\s*[1-9]/i.test(text);
      const hasCheckout = Array.from(document.querySelectorAll("button, a")).some((node) =>
        String(node.textContent || "").toLowerCase().includes("finalizar compra"),
      );
      return hasHeading && !isEmpty && (hasItemCount || hasCheckout);
    },
    { timeout: 30000 },
  );
  await saveScreenshot(page, "04-carrinho");
  summary.cart = {
    url: page.url(),
    itemCountLabelPresent: true,
  };
  pushStep("Carrinho validado", "ok");

  await goto(page, `${config.baseUrl}/checkout`);
  await dismissOptionalUi(page);
  await ensureCheckoutLoaded(page);
  await saveScreenshot(page, "05-checkout-inicial");
  pushStep("Checkout carregado", "ok");

  const authGateVisible = await isAuthGateVisible(page);
  if (authGateVisible) {
    if (config.authMode === "none") {
      summary.outcome = "auth_gate_reached";
      pushStep("Parada planejada no gate de autenticação", "ok");
      return;
    }

    if (config.authMode === "register") {
      await registerCustomer(page);
    }

    await loginCustomer(page);
    await dismissOptionalUi(page);
    await saveScreenshot(page, "06-checkout-autenticado");
  }

  await ensureCustomerPhone(page);
  await ensureShippingMode(page);
  await ensurePaymentMethod(page);
  await saveScreenshot(page, "07-checkout-pronto");

  if (!config.createOrder) {
    summary.outcome = "checkout_ready";
    pushStep("Parada segura antes da compra real", "ok");
    return;
  }

  pushStep("Enviar pedido", "info");
  await clickButtonByText(page, "Finalizar pedido");
  await page.waitForFunction(
    () => window.location.pathname.includes("/minha-conta") || (document.body?.innerText || "").includes("Pedido recebido!"),
    { timeout: 45000 },
  );
  await wait(2500);
  await saveScreenshot(page, "08-pos-pedido");

  const order = await extractOrderFromRequests();
  if (!order?.orderId) {
    throw new Error("O pedido parece ter sido enviado, mas não consegui capturar orderId/orderNumber da API");
  }

  summary.order = order;
  summary.outcome = "order_created";
  pushStep("Pedido criado", "ok", { orderId: order.orderId, orderNumber: order.orderNumber });
}

async function createIsolatedContext() {
  if (typeof browser.createBrowserContext === "function") {
    return browser.createBrowserContext();
  }
  if (typeof browser.createIncognitoBrowserContext === "function") {
    return browser.createIncognitoBrowserContext();
  }
  throw new Error("BrowserContext isolado não suportado pela versão atual do Puppeteer");
}

async function runJornaleiroFlow() {
  if (!summary.order?.orderId) {
    pushStep("Validação jornaleiro", "skip", { message: "Sem pedido criado" });
    return;
  }

  if (!config.jornaleiroEmail || !config.jornaleiroPassword) {
    pushStep("Validação jornaleiro", "skip", { message: "Credenciais do jornaleiro não informadas" });
    return;
  }

  const context = await createIsolatedContext();
  const page = await context.newPage();
  attachPageObservers(page, "jornaleiro");
  await page.setViewport({ width: 1440, height: 1200 });

  pushStep("Abrir login do jornaleiro", "info");
  await goto(page, `${config.baseUrl}/jornaleiro`);
  await dismissOptionalUi(page);
  await typeIn(page, "#email", config.jornaleiroEmail);
  await typeIn(page, "#password", config.jornaleiroPassword);
  await clickButtonByText(page, "Entrar");
  await page.waitForFunction(
    () => window.location.pathname.includes("/jornaleiro/dashboard"),
    { timeout: 30000 },
  );
  pushStep("Login do jornaleiro concluído", "ok", { email: config.jornaleiroEmail });

  await goto(page, `${config.baseUrl}/jornaleiro/pedidos`);
  await page.waitForFunction(
    () => {
      const text = document.body?.innerText || "";
      const hasRow = Array.from(document.querySelectorAll("a[href]")).some((link) =>
        String(link.getAttribute("href") || "").includes("/jornaleiro/pedidos/"),
      );
      return hasRow || text.includes("Nenhum pedido");
    },
    { timeout: 30000 },
  );
  await saveScreenshot(page, "09-jornaleiro-pedidos");

  await goto(page, `${config.baseUrl}/jornaleiro/pedidos/${summary.order.orderId}`);
  await page.waitForFunction(
    () => {
      const text = document.body?.innerText || "";
      return text.includes("Informações do Cliente") && text.includes("Ações");
    },
    { timeout: 30000 },
  );
  await saveScreenshot(page, "10-jornaleiro-pedido-detalhe");

  summary.jornaleiro = {
    orderId: summary.order.orderId,
    detailUrl: page.url(),
    statusAdvanced: false,
  };
  pushStep("Detalhe do pedido validado no painel do jornaleiro", "ok", { orderId: summary.order.orderId });

  if (!config.advanceJornaleiroStatus) {
    pushStep("Mudança de status do jornaleiro", "skip", { message: "SMOKE_ADVANCE_JORNALEIRO_STATUS=false" });
    await context.close();
    return;
  }

  await clickButtonByText(page, "Avançar Status");
  await wait(3000);
  await saveScreenshot(page, "11-jornaleiro-status-atualizado");

  const patchRequest = [...summary.requests]
    .reverse()
    .find((entry) => entry.page === "jornaleiro" && entry.url.includes("/api/orders") && entry.method === "PATCH");
  const clientWhatsapp = [...summary.requests]
    .reverse()
    .find((entry) => entry.page === "jornaleiro" && entry.url.includes("/api/whatsapp/status-update"));
  const jornaleiroWhatsapp = [...summary.requests]
    .reverse()
    .find((entry) => entry.page === "jornaleiro" && entry.url.includes("/api/whatsapp/jornaleiro-notification"));

  summary.jornaleiro = {
    ...summary.jornaleiro,
    statusAdvanced: true,
    patchRequest: patchRequest || null,
    clientWhatsapp: clientWhatsapp || null,
    jornaleiroWhatsapp: jornaleiroWhatsapp || null,
  };

  pushStep("Status avançado no painel do jornaleiro", "ok", {
    patchStatus: patchRequest?.status || null,
    clientWhatsappStatus: clientWhatsapp?.status || null,
    jornaleiroWhatsappStatus: jornaleiroWhatsapp?.status || null,
  });

  await context.close();
}

async function main() {
  await ensureOutputDir();

  browser = await puppeteer.launch({
    headless: config.headless,
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    attachPageObservers(page, "storefront");
    await page.setViewport({ width: 1440, height: 1200 });
    await runCustomerFlow(page);
    await runJornaleiroFlow();

    if (summary.outcome === "running") {
      summary.outcome = "completed";
    }

    pushStep("Smoke concluído", "ok", { outcome: summary.outcome });
  } catch (error) {
    summary.outcome = "failed";
    summary.error = {
      message: error.message,
      stack: error.stack,
    };
    pushStep("Smoke falhou", "fail", { message: error.message });
    throw error;
  } finally {
    summary.finishedAt = new Date().toISOString();
    await writeJson("summary.json", summary);
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}

main()
  .then(() => {
    console.log(`Resumo salvo em ${path.join(outputDir, "summary.json")}`);
  })
  .catch(() => {
    console.error(`Resumo salvo em ${path.join(outputDir, "summary.json")}`);
    process.exit(1);
  });
