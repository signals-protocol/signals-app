import React, { useEffect } from "react";

interface ShareModalProps {
  onClose: () => void;
}

export function ShareModal({ onClose }: ShareModalProps) {
  // ESC 키를 누르면 모달이 닫히도록 설정
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  // 모달 외부 클릭 시 닫히도록 설정
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCopyImage = () => {
    // 이미지 복사 기능 구현 (실제 구현은 추가 개발 필요)
    alert("이미지가 복사되었습니다.");
  };

  const handleShare = () => {
    // 공유 기능 구현 (실제 구현은 추가 개발 필요)
    alert("공유 기능이 실행되었습니다.");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
        <div className="p-4">
          {/* 상단 헤더 */}
          <div className="flex justify-between items-center mb-2">
            <div className="w-4 h-4" />
            <h3 className="text-xl font-bold">Share your Prediction 👀</h3>

            <button onClick={onClose} className="text-black text-xl w-4">
              ✕
            </button>
          </div>

          {/* 이미지 영역 */}
          <div className="w-full aspect-video rounded-lg mb-4">
            {/* 실제 이미지 또는 콘텐츠가 들어갈 자리 */}
            <img
              src="/share-ex.png"
              alt="공유 이미지"
              className="w-full h-full object-contain"
            />
          </div>

          {/* 하단 버튼 영역 */}
          <div className="flex gap-2">
            <button
              onClick={handleCopyImage}
              className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 px-4 flex-1 text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy Image
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-2 px-4 flex-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
