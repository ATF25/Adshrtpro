"use client";

import { useEffect, useRef } from "react";

interface AdEmbedProps {
  html: string;
  className?: string;
}

export function AdEmbed({ html, className = "" }: AdEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !html) {
      return;
    }

    container.innerHTML = "";
    const template = document.createElement("template");
    template.innerHTML = html.trim();

    const mountNode = document.createDocumentFragment();

    Array.from(template.content.childNodes).forEach((node) => {
      if (node.nodeName === "SCRIPT") {
        const sourceScript = node as HTMLScriptElement;
        const executableScript = document.createElement("script");

        Array.from(sourceScript.attributes).forEach((attribute) => {
          executableScript.setAttribute(attribute.name, attribute.value);
        });

        executableScript.text = sourceScript.textContent || "";
        mountNode.appendChild(executableScript);
        return;
      }

      mountNode.appendChild(node.cloneNode(true));
    });

    container.appendChild(mountNode);
  }, [html]);

  return (
    <div className={`flex justify-center px-4 ${className}`.trim()}>
      <div className="w-full max-w-full overflow-x-auto flex justify-center">
        <div ref={containerRef} className="flex justify-center" />
      </div>
    </div>
  );
}