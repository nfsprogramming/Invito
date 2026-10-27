"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";

export function TemplateRenderer({ 
  templateId, 
  previewMode = false 
}: { 
  templateId: string;
  previewMode?: boolean;
}) {
  const invitation = useStore((state) => state.invitation);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState("");
  
  // Keep track of the initial load so we only fetch once
  const initialLoadDone = useRef(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      // Don't re-fetch if we already loaded this template (unless it's a different template)
      setLoading(true);
      try {
        // We only send the basic data to avoid 413 Payload Too Large on giant photos
        const baseData = { ...invitation, couplePhoto: '', groomPhoto: '', bridePhoto: '' };
        
        const response = await fetch(`/api/preview?t=${Date.now()}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateId, data: baseData, previewMode }),
        });

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const html = await response.text();
        setHtmlContent(html);
      } catch (err) {
        console.error("TemplateRenderer fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]); // Removed invitation from dependencies

  // Watch for photo updates and send to iframe without reloading
  useEffect(() => {
    if (!loading && iframeRef.current?.contentWindow) {
      if (invitation.couplePhoto) {
        iframeRef.current.contentWindow.postMessage({
          type: 'UPDATE_PHOTO',
          photo: invitation.couplePhoto
        }, '*');
      }
      if (invitation.groomPhoto) {
        iframeRef.current.contentWindow.postMessage({
          type: 'UPDATE_GROOM_PHOTO',
          photo: invitation.groomPhoto
        }, '*');
      }
      if (invitation.bridePhoto) {
        iframeRef.current.contentWindow.postMessage({
          type: 'UPDATE_BRIDE_PHOTO',
          photo: invitation.bridePhoto
        }, '*');
      }
    }
  }, [invitation.couplePhoto, invitation.groomPhoto, invitation.bridePhoto, loading]);

  if (loading) {
    return (
      <div
        className="w-full h-full flex items-center justify-center bg-black min-h-[100dvh]"
      >
        <div
          className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "#C9A84C", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      className={`w-full h-full border-none block ${previewMode ? "pointer-events-none" : ""}`}
      title="Invitation Preview"
      sandbox="allow-scripts allow-same-origin"
      srcDoc={htmlContent}
    />
  );
}
