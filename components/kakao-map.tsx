"use client";

import { useEffect, useRef, useState } from "react";
import FallbackMap from "./fallback-map";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  placeName?: string;
  address?: string;
  className?: string;
}

export default function KakaoMap({
  latitude,
  longitude,
  placeName = "",
  address = "",
  className = "w-full h-96",
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldUseFallback, setShouldUseFallback] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    console.log("🗺️ 카카오맵 초기화 시작...");
    console.log("API Key exists:", !!apiKey);
    console.log("API Key length:", apiKey?.length || 0);
    console.log("Current domain:", window.location.hostname);
    console.log("Current protocol:", window.location.protocol);
    console.log("Current URL:", window.location.href);

    if (!apiKey) {
      console.error("❌ API 키가 없습니다.");
      setError("카카오맵 API 키가 설정되지 않았습니다.");
      setShouldUseFallback(true);
      setIsLoading(false);
      return;
    }

    // 30초 타임아웃 설정
    const timeoutId = setTimeout(() => {
      console.error("⏰ 카카오맵 로딩 타임아웃 (30초)");
      setError("카카오맵 로딩 시간이 초과되었습니다.");
      setShouldUseFallback(true);
      setIsLoading(false);
    }, 30000);

    const loadKakaoMap = () => {
      console.log("📍 카카오맵 스크립트 로딩 시도...");

      // 기존 스크립트가 있다면 제거
      const existingScript = document.querySelector(
        'script[src*="dapi.kakao.com"]'
      );
      if (existingScript) {
        console.log("🔄 기존 카카오맵 스크립트 제거");
        existingScript.remove();
      }

      const script = document.createElement("script");
      // HTTPS 강제 사용
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
      script.async = true;
      script.defer = true;

      console.log("🔗 스크립트 URL:", script.src);

      script.onload = () => {
        console.log("✅ 카카오맵 스크립트 로딩 완료");
        clearTimeout(timeoutId);

        if (!window.kakao || !window.kakao.maps) {
          console.error("❌ window.kakao.maps가 정의되지 않음");
          setError("카카오맵 SDK를 찾을 수 없습니다.");
          setShouldUseFallback(true);
          setIsLoading(false);
          return;
        }

        window.kakao.maps.load(() => {
          console.log("🗺️ 카카오맵 SDK 로딩 완료");
          initializeMap();
        });
      };

      script.onerror = (event) => {
        console.error("❌ 카카오맵 스크립트 로딩 실패");
        console.error("Error event:", event);
        console.error("Script src:", script.src);
        clearTimeout(timeoutId);

        // 더 구체적인 에러 메시지
        const errorMessage = getDetailedErrorMessage();
        setError(errorMessage);
        setShouldUseFallback(true);
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    const getDetailedErrorMessage = () => {
      const domain = window.location.hostname;
      const protocol = window.location.protocol;

      if (domain === "localhost" || domain === "127.0.0.1") {
        return `로컬 개발 환경에서 카카오맵을 사용하려면 카카오 개발자 콘솔에 '${protocol}//${domain}:3000'를 등록해야 합니다.`;
      } else {
        return `'${domain}' 도메인이 카카오 개발자 콘솔에 등록되지 않았거나 API 키가 유효하지 않습니다.`;
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) {
        console.error("❌ 맵 컨테이너를 찾을 수 없습니다.");
        return;
      }

      try {
        console.log("🎯 맵 초기화 중...", { latitude, longitude });
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);
        console.log("✅ 맵 생성 완료");

        // 마커 추가
        const markerPosition = new window.kakao.maps.LatLng(
          latitude,
          longitude
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
        console.log("📍 마커 추가 완료");

        // 정보창 추가
        if (placeName || address) {
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `
              <div style="padding:5px;font-size:12px;width:200px;">
                ${placeName ? `<strong>${placeName}</strong><br/>` : ""}
                ${address ? address : ""}
              </div>
            `,
          });
          infowindow.open(map, marker);
          console.log("💬 정보창 추가 완료");
        }

        setIsLoading(false);
        console.log("🎉 카카오맵 초기화 완료");
      } catch (err) {
        console.error("❌ 맵 초기화 오류:", err);
        setError("지도를 초기화할 수 없습니다.");
        setShouldUseFallback(true);
        setIsLoading(false);
      }
    };

    // 카카오맵이 이미 로딩되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      console.log("♻️ 기존 카카오맵 SDK 사용");
      clearTimeout(timeoutId);
      initializeMap();
    } else {
      loadKakaoMap();
    }

    return () => {
      console.log("🧹 카카오맵 컴포넌트 정리");
      clearTimeout(timeoutId);
    };
  }, [latitude, longitude, placeName, address]);

  // Fallback 맵 사용
  if (shouldUseFallback) {
    console.log("🔄 Fallback 맵 사용");
    return (
      <FallbackMap
        latitude={latitude}
        longitude={longitude}
        placeName={placeName || "인사동 한국미술관"}
        address={address || "서울특별시 종로구 인사동길 41-1"}
        className={className}
      />
    );
  }

  // 에러 표시 (fallback 없이)
  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg`}
      >
        <div className="text-center p-4">
          <p className="text-red-500 font-medium mb-2">🗺️ 지도 로딩 오류</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>

          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              <strong>해결 방법:</strong>
              <br />
              1. 카카오 개발자 콘솔에서 도메인 등록 확인
              <br />
              2. API 키가 올바른지 확인
              <br />
              3. 네트워크 연결 상태 확인
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              카카오맵 로딩 중...
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              최대 30초까지 소요될 수 있습니다.
            </p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg"
        style={{ minHeight: "300px" }}
      />
    </div>
  );
}
