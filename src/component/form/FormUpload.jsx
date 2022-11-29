import React, { useState, useMemo, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import CusModal from "../modal/CusModal";
import imageCompression from "browser-image-compression";
import {
  imageCompressOptions,
  imgMaxCount,
} from "../../config/general/img/imgConf";
import { useTranslation } from "react-i18next";
import LoadingModal from "../modal/LoadingModal";

const maxValidSize = 0.2; //mb
const maxSmSize = 0.01;

export default function FormUpload({
  type,
  hidden = true,
  message,
  multiple = true,
  accept,
  disabled = false,
  handleChange,
  maxSize = maxValidSize || imageCompressOptions.maxSizeMB, //in MB
  maxFiles = imgMaxCount,
  ...rest
}) {
  const { t } = useTranslation();
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [files, setFiles] = useState([]);
  const [warning, setWarning] = useState("");
  const [overSizedImgs, setOverSizedImgs] = useState([]);
  const [compressAlert, setCompressAlert] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  //drop zone
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
  } = useDropzone({
    accept,
    multiple,
    maxSize: maxSize * 1024 * 1024, //in bytes
    maxFiles: 0,
  });

  //   console.log("files", files);

  //func
  const handleCompressImg = React.useCallback(
    async (imgs = [], isSm = false) => {
      try {
        setShowLoading(true);
        const doneFileTemp = [];
        for (let i = 0; i < imgs.length; i++) {
          const osImg = imgs[i];
          let maxIteration = imageCompressOptions.maxIteration;
          // if (!isSm) {
          //   console.log(osImg);
          //   if (osImg.size < 1.5 * 1024 * 1024) {
          //     maxIteration = 2;
          //   }
          // }
          // else if (osImg.size > 1 * 1024 * 1024) maxIteration = 20;
          // console.log(1111111111111, maxIteration);
          const compressedFile = await imageCompression(osImg, {
            ...imageCompressOptions,
            maxSizeMB: isSm ? maxSmSize : maxValidSize,
            maxIteration: 20,
            // maxIteration: isSm ? 20 : maxIteration,
          });
          compressedFile && doneFileTemp.push(compressedFile);
        }
        // console.log(imgs, doneFileTemp);
        if (doneFileTemp.length === imgs.length) {
          // setFiles((prev) => [...prev, ...doneFileTemp]);
          if (!isSm) {
            setWarning(null);
            setOverSizedImgs([]);
            setCompressAlert(false);
          }
        }
        setShowLoading(false);
        if (doneFileTemp.length > 0) return doneFileTemp;
        else return [];
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const handleCancel = React.useCallback(() => {
    setFiles([]);
    setWarning("");
    setOverSizedImgs([]);
    setCompressAlert(false);
    setShowUploadArea(false);
  }, []);
  // console.log("acceptedFiles", acceptedFiles);
  // console.log("fileRejections", fileRejections);
  //effects
  //accepted directly push to files
  useEffect(() => {
    if (maxFiles !== 0 && files.length + acceptedFiles.length > maxFiles) {
      setWarning(`Too many files, max ${maxFiles} files are allowed`);
    } else {
      setWarning("");
      setFiles((prev) =>
        multiple ? [...prev, ...acceptedFiles] : acceptedFiles
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptedFiles, maxFiles, setWarning]);

  //rejected
  useEffect(() => {
    function errorFilter() {
      const overSizedImgsTemp = [];
      if (fileRejections.length > 0) {
        for (let i = 0; i < fileRejections.length; i++) {
          const errorFile = fileRejections[i];
          //// invalid type
          if (
            errorFile.errors?.find(
              (error) => error.code === "file-invalid-type"
            )
          ) {
            setWarning("File type error");
            return;
          }
          //too many files
          if (
            errorFile.errors?.find((error) => error.code === "too-many-files")
          ) {
            setWarning(`Too many files, max ${maxFiles} files are allowed`);
            return;
          }
          ////file too large
          else if (
            errorFile.errors?.find((error) => error.code === "file-too-large")
          ) {
            overSizedImgsTemp.push(errorFile.file);
          }
        }
        if (overSizedImgsTemp.length > 0) {
          setWarning(`图片大小超过 ${maxSize} MB 请压缩`);
          // setWarning(`File Over ${maxSize} MB is too large`);
          setOverSizedImgs(overSizedImgsTemp);
          setCompressAlert(true);
        }
        /// other error
        else {
          setWarning("File not accepted");
        }
      }
    }
    errorFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileRejections]);

  //on change, push files, compress files, push compressed files
  useEffect(() => {
    const func = async () => {
      // console.log("files", files);
      if (files.length > 0) {
        handleChange(false, files);
        const imgSmall = await handleCompressImg(files, true);
        console.log("imgSmall", imgSmall);
        handleChange(true, imgSmall);
      }
    };
    func();
    // files.length > 0 &&
  }, [files, handleChange]);

  // console.log(files);

  //   console.log(acceptedFiles);
  //   console.log("rejection", fileRejections);
  //   console.log(files);
  //   console.log(accept);
  //   console.log("accept", isDragAccept);
  //   console.log("not accept", isDragReject);

  //memo
  const imgList = useMemo(
    () =>
      files.map((file, index) => (
        <Box
          component="img"
          key={file.path + index}
          src={URL.createObjectURL(file)}
          alt=""
          sx={{
            height: "100px",
            width: "100px",
            border: "1px solid",
            borderColor: "#0000004d",
            borderRadius: 1,
            m: 1,
            p: 0.5,
            cursor: "pointer",
            transition: "all .2s ease-in-out",
            "&:hover": {
              borderColor: "rgba(0,123,255,.5)",
              boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
            },
          }}
        />
      )),
    [files]
  );

  const fileList = useMemo(
    () =>
      acceptedFiles.map((file) => (
        <div>
          {file.path} - {file.size} bytes
        </div>
      )),
    [acceptedFiles]
  );
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragAccept, isDragActive, isDragReject]
  );

  return (
    <>
      {hidden === true && (
        <div>
          {showUploadArea === false && (
            <Button onClick={() => setShowUploadArea(true)}>Upload</Button>
          )}
          {showUploadArea === true && (
            <Button onClick={handleCancel}>Cancel</Button>
          )}
        </div>
      )}
      {(hidden === false || showUploadArea === true) && (
        <section>
          <Box
            {...getRootProps({ className: "dropzone", style })}
            sx={{
              //hover animation
              borderColor: "#0000001a",
              "&:hover": { borderColor: "custom.selected" },
            }}
          >
            <input {...getInputProps()} />
            <div>{t("file.message.selection")}</div>
            {message && <div>({t(`file.message.${message}`)})</div>}
          </Box>
          <Typography color="error.main" sx={{ pl: 1 }}>
            {warning}
          </Typography>
          <Typography sx={{ pl: 1 }}>
            {files[0]
              ? "当前图片大小：" +
                parseFloat(files[0].size / 1000).toFixed(2) +
                "KB"
              : ""}
          </Typography>
          <aside>
            {type === "image" ? (
              <div>{imgList}</div>
            ) : type === "file" ? (
              <div>{fileList}</div>
            ) : (
              <></>
            )}
          </aside>
        </section>
      )}
      <CusModal
        open={compressAlert}
        onClose={() => setCompressAlert(false)}
        hideBackdrop
        size="xs"
      >
        <Box>
          <Box sx={{ mb: 2, textAlign: "center" }}>是否压缩图片？</Box>
          <div>
            <Button
              onClick={async () => {
                const compressedImgs = await handleCompressImg(overSizedImgs);
                // console.log("compressedImgs", compressedImgs);
                if (compressedImgs.length > 0) {
                  setFiles((prev) => [...prev, ...compressedImgs]);
                }
              }}
              variant="contained"
            >
              是
            </Button>
            <Button onClick={() => setCompressAlert(false)}>取消</Button>
          </div>
        </Box>
      </CusModal>
      <LoadingModal open={showLoading} />
    </>
  );
}

const baseStyle = {
  backgroundColor: "#0000001a",
  marginBottom: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "10px",
  padding: "15px",
  color: "#00000080",
  transition: "border .24s ease-in-out",
  borderWidth: 3,
  borderStyle: "dashed",
  cursor: "pointer",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

// function ImageUpload() {
//   return <></>;
// }
// function FileUpload() {
//   return <></>;
// }
