"use client";

import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  placeName: string;
  address: string;
  className?: string;
}

export function KakaoMap({
  latitude,
  longitude,
  placeName,
  address,
  className = "",
}: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

    if (!apiKey || apiKey === "your_kakao_map_api_key_here") {
      setMapError(true);
      return;
    }

    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        initializeMap();
      } else {
        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
        script.async = true;
        script.onload = () => {
          window.kakao.maps.load(() => {
            initializeMap();
          });
        };
        script.onerror = () => {
          setMapError(true);
        };
        document.head.appendChild(script);
      }
    };

    const initializeMap = () => {
      if (!mapContainer.current) return;

      try {
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapContainer.current, options);

        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(
          latitude,
          longitude
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);

        // 인포윈도우 생성
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `
            <div style="padding:10px; min-width:200px; text-align:center;">
              <div style="font-weight:bold; margin-bottom:5px; color:#333;">${placeName}</div>
              <div style="font-size:12px; color:#666;">${address}</div>
            </div>
          `,
        });

        // 마커에 클릭이벤트 등록
        window.kakao.maps.event.addListener(marker, "click", () => {
          infowindow.open(map, marker);
        });

        // 지도 클릭시 인포윈도우 닫기
        window.kakao.maps.event.addListener(map, "click", () => {
          infowindow.close();
        });

        setMapLoaded(true);
      } catch (error) {
        console.error("카카오맵 초기화 오류:", error);
        setMapError(true);
      }
    };

    loadKakaoMap();
  }, [latitude, longitude, placeName, address]);

  if (mapError) {
    return (
      <div
        className={`w-full h-64 rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center ${className}`}
      >
        <MapPin className="h-12 w-12 text-slate-400 mb-4" />
        <div className="text-center space-y-2">
          <h3 className="font-medium text-slate-700 dark:text-slate-300">
            {placeName}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {address}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            카카오맵을 불러올 수 없습니다
          </p>
          <a
            href={`https://map.kakao.com/link/search/${encodeURIComponent(
              placeName
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors"
          >
            카카오맵에서 보기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className={`w-full h-64 rounded-lg ${className}`}
      style={{ minHeight: "256px" }}
    />
  );
}
