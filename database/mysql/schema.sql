-- MySQL schema for Guia das Bancas (marketplace)
-- Engine: InnoDB, Charset: utf8mb4

CREATE DATABASE IF NOT EXISTS guiadasbancas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE guiadasbancas;

-- 1) Auth & Users
CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)      NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id        CHAR(36)      NOT NULL,
  role           ENUM('admin','jornaleiro','cliente') NOT NULL DEFAULT 'cliente',
  full_name      VARCHAR(255),
  phone          VARCHAR(30),
  avatar_url     VARCHAR(500),
  banca_id       CHAR(36)      NULL,
  email_verified TINYINT(1)    NOT NULL DEFAULT 0,
  active         TINYINT(1)    NOT NULL DEFAULT 1,
  created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_addresses (
  id           CHAR(36)     NOT NULL,
  user_id      CHAR(36)     NOT NULL,
  label        VARCHAR(100) NOT NULL,
  recipient    VARCHAR(255) NOT NULL,
  phone        VARCHAR(30),
  cep          VARCHAR(12)  NOT NULL,
  street       VARCHAR(255) NOT NULL,
  number       VARCHAR(30)  NOT NULL,
  complement   VARCHAR(255),
  neighborhood VARCHAR(255) NOT NULL,
  city         VARCHAR(255) NOT NULL,
  state        VARCHAR(2)   NOT NULL,
  is_default   TINYINT(1)   NOT NULL DEFAULT 0,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_addresses_user (user_id),
  CONSTRAINT fk_user_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 2) Bancas
CREATE TABLE IF NOT EXISTS bancas (
  id         CHAR(36)     NOT NULL,
  user_id    CHAR(36)     NOT NULL,
  name       VARCHAR(255) NOT NULL,
  whatsapp   VARCHAR(30),
  email      VARCHAR(255),
  cep        VARCHAR(12),
  address    VARCHAR(255),
  lat        DECIMAL(10,7),
  lng        DECIMAL(10,7),
  active     TINYINT(1)   NOT NULL DEFAULT 1,
  approved   TINYINT(1)   NOT NULL DEFAULT 0,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_bancas_user (user_id),
  KEY idx_bancas_active_approved (active, approved),
  CONSTRAINT fk_bancas_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS banca_opening_hours (
  id        CHAR(36)   NOT NULL,
  banca_id  CHAR(36)   NOT NULL,
  weekday   TINYINT    NOT NULL,
  opens_at  TIME       NULL,
  closes_at TIME       NULL,
  closed    TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_banca_day (banca_id, weekday),
  CONSTRAINT fk_boh_banca FOREIGN KEY (banca_id) REFERENCES bancas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS banca_payment_methods (
  id       CHAR(36)   NOT NULL,
  banca_id CHAR(36)   NOT NULL,
  method   ENUM('dinheiro','debito','credito','pix') NOT NULL,
  enabled  TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_bpm (banca_id, method),
  CONSTRAINT fk_bpm_banca FOREIGN KEY (banca_id) REFERENCES bancas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS banca_delivery_settings (
  id                  CHAR(36)    NOT NULL,
  banca_id            CHAR(36)    NOT NULL,
  delivery_fee        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  min_order_value     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  delivery_radius_km  DECIMAL(5,2)  NOT NULL DEFAULT 5.00,
  preparation_time_min INT          NOT NULL DEFAULT 30,
  PRIMARY KEY (id),
  UNIQUE KEY uq_bds (banca_id),
  CONSTRAINT fk_bds_banca FOREIGN KEY (banca_id) REFERENCES bancas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3) Catálogo
CREATE TABLE IF NOT EXISTS categories (
  id         CHAR(36)     NOT NULL,
  name       VARCHAR(255) NOT NULL,
  slug       VARCHAR(255) NOT NULL UNIQUE,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id               CHAR(36)     NOT NULL,
  banca_id         CHAR(36)     NOT NULL,
  name             VARCHAR(255) NOT NULL,
  slug             VARCHAR(255) NOT NULL,
  description      TEXT,
  price            DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  sku              VARCHAR(100),
  active           TINYINT(1)   NOT NULL DEFAULT 1,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_product_slug_banca (banca_id, slug),
  KEY idx_products_banca_active (banca_id, active),
  CONSTRAINT fk_products_banca FOREIGN KEY (banca_id) REFERENCES bancas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_images (
  id         CHAR(36)     NOT NULL,
  product_id CHAR(36)     NOT NULL,
  url        VARCHAR(500) NOT NULL,
  position   INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_pi_p (product_id),
  CONSTRAINT fk_pi_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_categories (
  product_id  CHAR(36) NOT NULL,
  category_id CHAR(36) NOT NULL,
  PRIMARY KEY (product_id, category_id),
  CONSTRAINT fk_pc_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_pc_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inventory (
  id          CHAR(36)   NOT NULL,
  product_id  CHAR(36)   NOT NULL,
  stock       INT        NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 5,
  updated_at  DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_inventory_product (product_id),
  CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS stock_movements (
  id          CHAR(36)   NOT NULL,
  product_id  CHAR(36)   NOT NULL,
  type        ENUM('in','out','adjust') NOT NULL,
  quantity    INT        NOT NULL,
  reason      VARCHAR(255),
  created_at  DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sm_product (product_id),
  CONSTRAINT fk_sm_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4) Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id              CHAR(36)     NOT NULL,
  customer_id     CHAR(36)     NOT NULL,
  banca_id        CHAR(36)     NOT NULL,
  status          ENUM('novo','confirmado','em_preparo','pronto','saiu_entrega','entregue','cancelado') NOT NULL DEFAULT 'novo',
  payment_status  ENUM('pendente','pago','falhou','estornado') NOT NULL DEFAULT 'pendente',
  subtotal        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  delivery_fee    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount_total  DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total           DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  delivery_type   ENUM('retirada','entrega') NOT NULL DEFAULT 'entrega',
  delivery_address_id CHAR(36),
  notes           VARCHAR(1000),
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_orders_banca_status (banca_id, status),
  KEY idx_orders_customer (customer_id),
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES users(id),
  CONSTRAINT fk_orders_banca FOREIGN KEY (banca_id) REFERENCES bancas(id),
  CONSTRAINT fk_orders_delivery_addr FOREIGN KEY (delivery_address_id) REFERENCES user_addresses(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id          CHAR(36)    NOT NULL,
  order_id    CHAR(36)    NOT NULL,
  product_id  CHAR(36)    NOT NULL,
  name        VARCHAR(255) NOT NULL,
  unit_price  DECIMAL(10,2) NOT NULL,
  quantity    INT         NOT NULL,
  total       DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- 5) Pagamentos & Payouts
CREATE TABLE IF NOT EXISTS payments (
  id           CHAR(36)    NOT NULL,
  order_id     CHAR(36)    NOT NULL,
  provider     ENUM('manual','pix','cartao','gateway') NOT NULL DEFAULT 'manual',
  provider_ref VARCHAR(255),
  amount       DECIMAL(10,2) NOT NULL,
  status       ENUM('pendente','pago','falhou','estornado') NOT NULL DEFAULT 'pendente',
  payload      JSON,
  created_at   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payments_order (order_id),
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payment_refunds (
  id         CHAR(36)    NOT NULL,
  payment_id CHAR(36)    NOT NULL,
  amount     DECIMAL(10,2) NOT NULL,
  reason     VARCHAR(255),
  created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_payment_refunds_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payouts (
  id           CHAR(36)    NOT NULL,
  banca_id     CHAR(36)    NOT NULL,
  order_id     CHAR(36)    NOT NULL,
  gross_amount DECIMAL(10,2) NOT NULL,
  fee_amount   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  net_amount   DECIMAL(10,2) AS (gross_amount - fee_amount) PERSISTENT,
  status       ENUM('pendente','pago','falhou') NOT NULL DEFAULT 'pendente',
  paid_at      DATETIME NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payout_order (order_id),
  KEY idx_payouts_banca_status (banca_id, status),
  CONSTRAINT fk_payouts_banca FOREIGN KEY (banca_id) REFERENCES bancas(id) ON DELETE CASCADE,
  CONSTRAINT fk_payouts_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6) Favoritos, Reviews, Cupons
CREATE TABLE IF NOT EXISTS favorites (
  user_id    CHAR(36)   NOT NULL,
  product_id CHAR(36)   NOT NULL,
  created_at DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, product_id),
  CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_fav_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reviews (
  id          CHAR(36)   NOT NULL,
  user_id     CHAR(36)   NOT NULL,
  product_id  CHAR(36)   NOT NULL,
  rating      TINYINT    NOT NULL,
  comment     VARCHAR(1000),
  created_at  DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_review_user_product (user_id, product_id),
  KEY idx_reviews_product (product_id, rating),
  CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS coupons (
  id         CHAR(36)    NOT NULL,
  code       VARCHAR(50) NOT NULL UNIQUE,
  label      VARCHAR(255),
  type       ENUM('percent','fixed','free_shipping') NOT NULL,
  value      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  min_order  DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  active     TINYINT(1)   NOT NULL DEFAULT 1,
  starts_at  DATETIME NULL,
  ends_at    DATETIME NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id         CHAR(36)   NOT NULL,
  coupon_id  CHAR(36)   NOT NULL,
  user_id    CHAR(36)   NOT NULL,
  order_id   CHAR(36)   NOT NULL,
  created_at DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_coupon_order (coupon_id, order_id),
  CONSTRAINT fk_cr_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
  CONSTRAINT fk_cr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_cr_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7) Notificações, Webhooks, Auditoria
CREATE TABLE IF NOT EXISTS notifications (
  id         CHAR(36)     NOT NULL,
  user_id    CHAR(36)     NULL,
  banca_id   CHAR(36)     NULL,
  channel    ENUM('whatsapp','push','email','inapp') NOT NULL,
  type       VARCHAR(100) NOT NULL,
  payload    JSON,
  sent       TINYINT(1)   NOT NULL DEFAULT 0,
  error_msg  VARCHAR(1000),
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notifications_user (user_id),
  KEY idx_notifications_banca (banca_id),
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_notif_banca FOREIGN KEY (banca_id) REFERENCES bancas(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS webhook_events (
  id         CHAR(36)    NOT NULL,
  provider   VARCHAR(100) NOT NULL,
  event      VARCHAR(100) NOT NULL,
  payload    JSON,
  processed  TINYINT(1)  NOT NULL DEFAULT 0,
  error_msg  VARCHAR(1000),
  created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_webhook_provider_event (provider, event)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_logs (
  id            CHAR(36)     NOT NULL,
  actor_user_id CHAR(36)     NULL,
  action        VARCHAR(100) NOT NULL,
  entity_type   VARCHAR(100) NOT NULL,
  entity_id     CHAR(36)     NULL,
  meta          JSON,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_actor (actor_user_id),
  KEY idx_audit_entity (entity_type, entity_id),
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
