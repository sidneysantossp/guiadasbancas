"use client";

import { useEffect, useState } from "react";

type AcademyVideo = {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  youtube_id: string;
  category: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
};

export default function AcademyPage() {
  const [videos, setVideos] = useState<AcademyVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<AcademyVideo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/academy/videos');
      const json = await res.json();

      if (json.success) {
        setVideos(json.videos || []);
        // Selecionar primeiro vídeo automaticamente
        if (json.videos && json.videos.length > 0) {
          setSelectedVideo(json.videos[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(videos.map(v => v.category).filter(Boolean))) as string[];
  
  const filteredVideos = selectedCategory === "all" 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum vídeo disponível</h3>
        <p className="mt-1 text-sm text-gray-500">
          Os vídeos tutoriais estarão disponíveis em breve.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🎓 Academy</h1>
        <p className="mt-1 text-sm text-gray-600">
          Aprenda a usar a plataforma com nossos vídeos tutoriais
        </p>
      </div>

      {/* Filtro por categoria */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player de vídeo */}
        <div className="lg:col-span-2">
          {selectedVideo ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtube_id}`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900">{selectedVideo.title}</h2>
                {selectedVideo.description && (
                  <p className="mt-2 text-gray-600 text-sm">{selectedVideo.description}</p>
                )}
                {selectedVideo.category && (
                  <div className="mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      {selectedVideo.category}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-2xl aspect-video flex items-center justify-center">
              <p className="text-gray-500">Selecione um vídeo para assistir</p>
            </div>
          )}
        </div>

        {/* Lista de vídeos */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              Vídeos ({filteredVideos.length})
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredVideos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedVideo?.id === video.id
                      ? "bg-orange-50 border-2 border-orange-500"
                      : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <img
                        src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-20 h-14 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {video.title}
                      </h4>
                      {video.category && (
                        <p className="text-xs text-gray-500 mt-1">{video.category}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
