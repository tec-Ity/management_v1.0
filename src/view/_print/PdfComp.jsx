import React from "react";
import { exportPDF } from "../../utils/file/exportPDF";

export default function PdfComp({ content, title, onSave }) {
  const pdfRef = React.useRef(null);

  React.useEffect(() => {
    content && exportPDF(title, pdfRef.current);
    onSave();
  }, [content]);

  return (
    <div>
      <div ref={pdfRef}>{content}</div>
    </div>
  );
}
