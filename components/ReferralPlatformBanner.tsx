'use client';

import React from 'react';

const ReferralPlatformBanner = () => {
  return (
    <div className="py-6">
      <div className="container-max">
        <a 
          href="/indicar"
          className="relative w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow block"
        >
          <div className="relative h-96 sm:h-64 md:h-72 w-full bg-gray-800">
            {/* Imagem de fundo */}
            <img
              src="https://lh3.googleusercontent.com/gg/AAHar4ez4stpNWSyhtcKIAQdeA4bUIFfC_wbg06xK_bhJNwv7-6WCuWHfszyh8YU8B2YPf2h6mzp3OAvwWLIqfBU1PeEfl9jE8T_Gim7uvt8GCiKYXqiVIHK45aO9-NOC90ppaLjsJuWsj19ofzQNniCIW8tGUSgzVO_JX7GZsaNG40LamP77jTiT9B1Bbwbqq5eBqJUPmdWLp8h-gaDYYku0cUfsElkXiYmDoGIn8HV1AXZg1hgG-uhDJ8o4v9vTJ4d2E_yL0DUbct5q6Ka9dIaZyXjbSAa8N2x9OjnOIQO6QFICsKctq6-LxlzhEfdzymQrGE7TXpnjOpZsd6OpOfe_Lxb=s1024-rj?authuser=1"
              alt="Indique a Plataforma"
              className="w-full h-full object-cover object-center"
              style={{ objectPosition: '60% 40%' }}
              onError={(e) => {
                console.log('Erro ao carregar imagem do banner');
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            
            {/* Overlay escuro para melhor legibilidade do texto */}
            <div className="absolute inset-0 bg-black/50"></div>
            
            {/* Conteúdo */}
            <div className="absolute inset-0 px-6 sm:px-8 md:px-12 flex flex-col justify-center items-start text-white">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
                Indique a Plataforma e ganhe benefícios
              </h3>
              
              <p className="text-lg sm:text-xl max-w-2xl opacity-90 mb-6 leading-relaxed">
                Convide amigos e familiares para conhecer as melhores bancas. Você ajuda a comunidade e ainda pode ganhar recompensas.
              </p>
              
              <span className="inline-flex items-center justify-center rounded-lg text-lg font-semibold px-8 py-3 bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-colors">
                Indicar agora
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default ReferralPlatformBanner;
