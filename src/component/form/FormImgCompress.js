import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { useDispatch, useSelector } from "react-redux";
import { axios_Prom } from "../../api/api";
import { fetchObj } from "../../config/module/prod/prodConf";
import { putObject } from "../../redux/fetchSlice";
const maxValidSize = 0.2; //mb
const maxSmSize = 0.01;
export default function FormImgCompress() {
  const [files, setFiles] = useState();
  const dispatch = useDispatch();
  const prodsAll = useSelector((state) => state.prodStorage.prodsAll);
  const { byCode, allCodes } = prodsAll || {};
  const findProd = (imgName) => {
    for (let i = 0; i < allCodes.length; i++) {
      const code = allCodes[i];
      const prod = byCode[code];
      const { img_url } = prod;
      const name = img_url.split("/")[3];
      // console.log(prod);
      // console.log(i, name);
      if (name === imgName) return prod;
    }
  };
  const putProdImg = async (img, img_xs, prodId, prod) => {
    const formData = new FormData();
    formData.append("obj", JSON.stringify(prod));
    img && formData.append("img_url", img);
    img_xs && formData.append("img_xs", img_xs);
    const api = "/prod/" + prodId;
    // const putRes = await axios_Prom(api, "PUT", formData);
    // console.log(putRes);
    dispatch(putObject({ fetchObj, id: prodId, data: formData }));
  };
  const onDrop = React.useCallback(async (acceptedFiles) => {
    console.log(acceptedFiles);
    for (let i = 0; i < acceptedFiles.length; i++) {
      console.log(i, "/", acceptedFiles.length);
      const file = acceptedFiles[i];
      const name = file.name;
      if (name.includes("_sm-")) continue;
      const prod = findProd(name);
      const prodId = prod?._id;
      console.log("prodId", prodId);
      if (!prodId) {
        console.log(name, "not exist prod");
        continue;
      }
      const img = await imageCompression(file, {
        // ...imageCompressOptions,
        maxSizeMB: maxValidSize,
        maxIteration: 20,
      });
      const img_xs = await imageCompression(img, {
        maxSizeMB: maxSmSize,
        maxIteration: 20,
      });
      console.log(img, img_xs);

      putProdImg(img, img_xs, prodId, prod);
    }
  }, []);
  const {
    // acceptedFiles,
    // fileRejections,
    getRootProps,
    getInputProps,
    // open,
    // isDragActive,
    // isDragReject,
    // isDragAccept,
  } = useDropzone({
    accept: "image/*",
    multiple: true,
    // maxSize: maxValidSize * 1024 * 1024, //in bytes
    maxFiles: 0,
    onDrop,
  });

  return (
    <section>
      <div
        {...getRootProps()}
        style={{ width: 500, height: 200, border: "1px solid" }}
      >
        <div>open</div>
        <input {...getInputProps()} />
      </div>
    </section>
  );
}
