import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { AiFillCloseCircle, AiOutlineDownload } from "react-icons/ai";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer = ({ pdfUrl, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError(null); // Clear any previous errors
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading document:", error);
    setError(error);
  };

  const downloadPdf = (url) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "resume.pdf"; // Specify the filename with .pdf extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading PDF:", error);
        alert("Error downloading PDF: " + error.message);
      });
  };

  return (
    <div className="absoulte h-screen w-screen overflow-y-auto z-[500] rounded fixed bottom-0 left-0 backdrop-filter backdrop-blur-sm bg-blue-200 bg-opacity-40  shadow-lg gil-reg overflow-x-hidden no-scrollbar">
      <div className="fixed  inset-0 bg-bg3 z-50 flex flex-col justify-center rounded-lg overflow-y-auto items-center md:min-w-[50%] md:max-w-fit lg:w-[60%] w-[100%] h-[98%] md:h-[95%] lg:h-[50%] m-auto shadow-lg  no-scrollbar">
        <div className="flex flex-col relative items-center w-[100%] h-full py-5">
          <div className="w-[95%] flex justify-end gap-5">
            <button
              onClick={() => downloadPdf(pdfUrl)}
              className="text-primary border border-primary -mt-1 mb-0.5  z-50 flex  text-md p-1 px-2 rounded-md font-medium cursor-pointer items-center gap-2  justify-center"
            >
              Download as a PDF
              <AiOutlineDownload />
            </button>
            <AiFillCloseCircle
              className="text-primary  text-2xl cursor-pointer z-50 "
              onClick={onClose}
            />
          </div>

          <div className="h-[97%] w-full  overflow-y-auto">
            {error ? (
              <p>Error loading PDF: {error.message}</p>
            ) : (
              <>
                <div className="md:w-full md:flex md:justify-center">
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                  >
                    <Page
                      className="w-[100%]"
                      renderTextLayer={false}
                      pageNumber={pageNumber}
                    />
                  </Document>
                </div>
                <span className="flex justify-center w-full z-50">
                  <button
                    onClick={() => setPageNumber(pageNumber - 1)}
                    disabled={pageNumber <= 1}
                  >
                    <MdChevronLeft />
                  </button>
                  <p>
                    Page {pageNumber} of {numPages}
                  </p>
                  <button
                    onClick={() => setPageNumber(pageNumber + 1)}
                    disabled={pageNumber >= numPages}
                  >
                    <MdChevronRight />
                  </button>
                </span>
                {/* <button
                onClick={() => downloadPdf(pdfUrl)}
                className="text-primary z-50 flex text-xl underline font-medium cursor-pointer items-end justify-center"
              >
                Download
              </button> */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
