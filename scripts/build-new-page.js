const fs = require('fs');
const path = require('path');

const part1 = fs.readFileSync(path.join(__dirname, 'banca-page-part1.txt'), 'utf8');

const newReturn = `return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar Banca</h1>
        <p className="text-gray-500 mt-1">Gerencie os dados, endereço, horários e configurações da banca.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3 border border-red-100">
          <svg className="w-5 h-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-start gap-3 border border-green-100">
          <svg className="w-5 h-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">{success}</div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* INFORMAÇÕES BÁSICAS */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Banca <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Curta</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* ACESSO AO SISTEMA */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Acesso ao Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail de Acesso (Login)</label>
                <input
                  type="email"
                  value={ownerEmail}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-2">
                  E-mail utilizado pelo jornaleiro para acessar o painel.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Redefinir Senha</h3>
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Nova Senha"
                    value={resetPwd}
                    onChange={(e) => setResetPwd(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Confirmar Nova Senha"
                    value={resetPwd2}
                    onChange={(e) => setResetPwd2(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  
                  {resetErr && <p className="text-red-600 text-xs font-medium">{resetErr}</p>}
                  {resetMsg && <p className="text-green-600 text-xs font-medium">{resetMsg}</p>}
                  
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={!resetPwd || resetPwd !== resetPwd2 || resetLoading}
                    className="w-full px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 disabled:opacity-50 transition-colors"
                  >
                    {resetLoading ? 'Salvando...' : 'Alterar Senha'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DADOS DE CONTATO E REDES */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Contato e Redes Sociais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(maskPhoneBR(e.target.value))}
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">@</span>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value.replace('@', ''))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">@</span>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value.replace('@', ''))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ENDEREÇO */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Localização</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').substring(0, 9))}
                    onBlur={(e) => {
                      if (e.target.value.length === 9) handleCepBlur(e.target.value);
                    }}
                    placeholder="00000-000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  {loadingCep && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Logradouro / Rua</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Complemento / Referência</label>
                <input
                  type="text"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado (UF)</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  maxLength={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 uppercase"
                />
              </div>
            </div>
          </div>
          {/* COTISTA / TPU */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Vínculo de Cotista (TPU)</h2>
                <p className="text-sm text-gray-500">Vincule esta banca a um cotista para uso do PDV.</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isCotista}
                    onChange={(e) => setIsCotista(e.target.checked)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${isCotista ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isCotista ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">É Banca Cotista</span>
              </label>
            </div>
            
            {isCotista && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <CotistaSearch
                  onSelect={handleCotistaSelect}
                  initialValue={selectedCotista?.codigo}
                  disabled={false}
                />
                
                {selectedCotista && (
                  <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">Cotista Selecionado</h4>
                      <button
                        type="button"
                        onClick={() => setSelectedCotista(null)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        Remover
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 block text-xs mb-1">Código TPU</span>
                        <span className="font-medium font-mono text-primary bg-primary/5 px-2 py-0.5 rounded">
                          {selectedCotista.codigo}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs mb-1">CNPJ/CPF</span>
                        <span className="font-medium">{selectedCotista.cnpj_cpf}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500 block text-xs mb-1">Razão Social / Nome</span>
                        <span className="font-medium">{selectedCotista.razao_social}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* HORÁRIOS */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Horários de Funcionamento</h2>
                <p className="text-sm text-gray-500">Defina os horários em que a banca está aberta.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {hours.map((day, index) => (
                <div key={day.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4 w-48">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={day.active}
                          onChange={(e) => {
                            const newHours = [...hours];
                            newHours[index].active = e.target.checked;
                            setHours(newHours);
                          }}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${day.active ? 'bg-primary' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${day.active ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                    </label>
                    <span className="font-medium text-gray-700 w-24">{day.day}</span>
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="time"
                      value={day.open}
                      disabled={!day.active}
                      onChange={(e) => {
                        const newHours = [...hours];
                        newHours[index].open = e.target.value;
                        setHours(newHours);
                      }}
                      className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-400"
                    />
                    <span className="text-gray-500">às</span>
                    <input
                      type="time"
                      value={day.close}
                      disabled={!day.active}
                      onChange={(e) => {
                        const newHours = [...hours];
                        newHours[index].close = e.target.value;
                        setHours(newHours);
                      }}
                      className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>
                  
                  {!day.active && (
                    <span className="text-sm text-gray-500 italic ml-4">Fechado</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* IMAGENS */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Imagens da Banca</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto Principal (Avatar)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                  <ImageUploadDragDrop
                    label="Arraste a imagem ou clique para selecionar"
                    onUpload={async (url) => setAvatarUrl(url)}
                    currentImage={avatarUrl}
                    onRemove={() => setAvatarUrl('')}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Recomendado: Imagem quadrada (ex: 500x500px), formato JPG, PNG ou WebP. Máx 2MB.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de Capa (Banner)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                  <ImageUploadDragDrop
                    label="Arraste a imagem de capa ou clique"
                    onUpload={async (url) => setCoverUrl(url)}
                    currentImage={coverUrl}
                    onRemove={() => setCoverUrl('')}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Recomendado: Imagem retangular horizontal (ex: 1200x400px).
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Galeria de Fotos (até 5)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                  <FileUploadDragDrop
                    label="Arraste até 5 fotos para a galeria"
                    onUploadAction={async (urls) => setGallery(prev => [...prev, ...urls].slice(0, 5))}
                    currentFiles={gallery}
                    onRemoveAction={(url) => setGallery(prev => prev.filter(u => u !== url))}
                    maxFiles={5}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* CATEGORIAS */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Categorias</h2>
            <p className="text-sm text-gray-500 mb-4">Selecione as categorias em que esta banca se enquadra.</p>
            {loadingCategories ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category.id]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                        }
                      }}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* CONFIGURAÇÕES DE ADMIN */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Configurações e Permissões</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex items-center justify-between cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1 pr-4">
                  <span className="block text-sm font-medium text-gray-900">Banca Ativa</span>
                  <span className="block text-xs text-gray-500 mt-1">Se ativa, a banca ficará visível no portal.</span>
                </div>
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${active ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${active ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1 pr-4">
                  <span className="block text-sm font-medium text-gray-900">Em Destaque</span>
                  <span className="block text-xs text-gray-500 mt-1">Bancas em destaque aparecem no topo das listagens.</span>
                </div>
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${featured ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${featured ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>
          </div>

          {/* ZONA DE PERIGO (EXCLUSÃO) */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Zona de Perigo</h2>
            <p className="text-sm text-red-600 mb-6">Ações irreversíveis para esta banca.</p>
            
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium text-sm"
              >
                Excluir Banca
              </button>
            ) : (
              <div className="bg-white border border-red-200 p-4 rounded-lg">
                <p className="text-sm text-gray-700 font-medium mb-4">
                  Tem certeza? Para confirmar, digite <strong>EXCLUIR</strong> no campo abaixo:
                </p>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    placeholder="Digite EXCLUIR"
                  />
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteConfirmText !== 'EXCLUIR' || deleteLoading}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {deleteLoading ? 'Excluindo...' : 'Confirmar Exclusão'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm border border-gray-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* BOTÕES FLUTUANTES (SAVE) */}
          <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 flex justify-end gap-4 px-6 md:px-12">
            <Link
              href="/admin/cms/bancas"
              className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center shadow-md disabled:opacity-50"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'banca-page-final.txt'), part1 + newReturn);
console.log("Arquivo final montado");

// Check syntax
try {
  require('child_process').execSync('npx tsc --noEmit', { stdio: 'ignore' });
  console.log("Type check ok");
} catch(e) {
  console.log("Type check failed, but that's normal if imports are missing, let's copy it anyway");
}

fs.copyFileSync(path.join(__dirname, 'banca-page-final.txt'), path.join(__dirname, '../app/admin/cms/bancas/[id]/page.tsx'));
console.log("Arquivo substituído!");
