import React from "react";
//config
import prodFormInputs, {
  prodFormImg,
} from "../../../config/module/prod/prodFormInputs";
import { fetchObj, fetchObjs } from "../../../config/module/prod/prodConf";
//component
import CusItemList from "../../../component/list/CusItemList";
import { axios_Prom } from "../../../api/api";
import { Box, Tooltip, Typography, Paper } from "@mui/material";
import getPrice from "../../../utils/price/getPrice";
import prodImg from "../../../assets/icons/prodImg.png";
import ProdDetail from "../detail/ProdDetail";
import CusDialog from "../../../component/modal/CusDialog";
import CategoryIcon from "@mui/icons-material/Category";
import CategModal from "./CategModal";
import { useSelector } from "react-redux";
import categConf from "../../../config/module/category/categConf";

const renderProdPrice = (field) => (params) => {
  const is_simple = params?.row?.is_simple;
  if (is_simple) return getPrice(params?.value);
  else if (field === "price_sale")
    return `${getPrice(params?.row?.price_min)} ~ ${getPrice(
      params?.row?.price_max
    )}`;
  else return "";
};

const renderProdQuantity = (params) => {
  if (params?.row?.is_simple) return params?.value;
  else return params?.row?.Skus?.reduce((sum, sku) => sum + sku.quantity, 0);
};

const renderProdCateg = (params) => {
  // console.log(params);
  const { value } = params;
  let categs = "";
  if (value.length > 0) {
    categs = value.map((v, index) => v.code || v)?.join(", ");
    return (
      <Tooltip title={<Typography>{categs}</Typography>} placement="top" arrow>
        <Typography>{categs}</Typography>
      </Tooltip>
    );
  } else return "无分类";
};

export default function ProdList() {
  // const postSubmittedCallback = useCallback(() => {}, []);
  const [prodAnalysis, setProdAnalysis] = React.useState({});
  const [showCategModal, setShowCategModal] = React.useState(false);
  const getProdTotFunc = async () => {
    const res = await axios_Prom("/ProdTotal", "POST");
    console.log(res);
    if (res.status === 200) {
      setProdAnalysis(res.total[0]);
    }
  };
  React.useEffect(() => {
    getProdTotFunc();
  }, []);

  return (
    <>
      <CusItemList
        formInputs={prodFormInputs}
        fileInput={prodFormImg}
        fetchObjs={fetchObjs}
        fetchObj={fetchObj}
        // submittedCallback={postSubmittedCallback}
        moreDetails
        showBatch
        actionObjs={[
          {
            btnProps: { sx: { width: "100%", fontWeight: 600 } },
            label: (
              <>
                <CategoryIcon sx={{ mr: 2 }} /> 分类管理
              </>
            ),
            onClick: () => setShowCategModal(true),
          },
        ]}
        dataGridProps={{
          hasImage: true,
          columns: [
            {
              show: false,
              field: "is_simple",
              width: 60,
              renderCell: (params) => (params?.value ? "单" : "多规格"),
              sortType: "none",
              // sortType: "boolean",
            },
            {
              field: "price_sale",
              width: 120,
              renderCell: renderProdPrice("price_sale"),
            },
            {
              field: "price_regular",
              width: 120,
              renderCell: renderProdPrice("price_regular"),
            },
            {
              field: "quantity",
              renderCell: renderProdQuantity,
            },
            { field: "Categs", width: 120, renderCell: renderProdCateg },
            {
              field: "unit",
              width: 60,
              renderCell: (params) =>
                params?.value && params.value != "undefined"
                  ? params.value
                  : "件",
            },
            {
              field: "weight",
              renderCell: (params) => `${params.value || 0} KG`,
            },
            { field: "price_cost", dataType: "price" },
            { field: "totStock", dataType: "price", sortType: "none" },
          ],
          getRowsExtra: (obj) => ({
            totStock: obj?.quantity * obj?.price_cost,
          }),
        }}
        filterOptions={[
          {
            label: "Categs",
            field: "Categs",
            dataType: "array",
            inputProps: {
              itemType: "autoComplete",
              fetchObjs: categConf.fetchObjs,
              optionLabel: "nome",
              optionValue: "_id",
            },
          },
          {
            label: "is_discount",
            field: "is_discount",
            inputProps: {
              itemType: "checkBox",
            },
          },
        ]}
        CardMB={CardMB}
        title="prods"
        CustomPutModal={({ objectId, onClose, ...rest }) => (
          <CusDialog
            onClose={onClose}
            {...rest}
            content={<ProdDetail _id={objectId} onClose={onClose} />}
          />
        )}
      />
      <Paper
        sx={{
          position: "fixed",
          left: { xs: "2%", md: "10%" },
          bottom: "2%",
          minWidth: 200,
          px: 1,
          display: { xs: "inherit", md: "flex" },
          bgcolor: { xs: "primary.main", md: "transparent" },
        }}
      >
        <Typography sx={{ mr: 3 }}>总库存：{prodAnalysis?.quantity}</Typography>
        <Typography>总成本：{getPrice(prodAnalysis?.price_cost)}</Typography>
      </Paper>
      {/* submitted call back alert modal */}
      {/* <CusDialog
        open={showSubmittedModal}
        onClose={() => {
          setShowSubmittedModal(true);
        }}
        content="Continue Edit Attrs & Skus?"
        actions={[
          { label: "YES", onClick: () => {} },
          { label: "NO", onClick: () => {} },
        ]}
      /> */}
      <CategModal
        open={showCategModal}
        onClose={() => setShowCategModal(false)}
      />
    </>
  );
}

const CardMB = ({ obj, DNS, handleImageClick }) => {
  const longPrice = obj.price_min !== obj.price_max;
  const allow_Supplier = useSelector(
    (state) => state.auth?.userInfo?.Shop?.allow_Supplier
  );
  let code = obj.code;
  let sup = obj.Supplier?.code;
  if (allow_Supplier && sup) code += `-${sup}`;
  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="img"
        onClick={handleImageClick(obj.img_url)}
        src={obj.img_xs ? DNS + obj.img_xs : prodImg}
        alt=""
        sx={{
          pr: 0.5,
          boxSizing: "border-box",
          // height: "100%",
          maxHeight: 95,
          width: 90,
          backgroundColor: "custom.white",
          objectFit: "scale-down",
          my: "auto",
          borderRadius: "20px",
        }}
      />
      <Box
        sx={{
          width: `calc(100% - 80px)`,
          display: "flex",
        }}
      >
        <Box
          sx={{
            width: { xs: "40%", md: "65%" },
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ py: 2 }}>
            {[code, obj.nome, obj.nomeTR].map((item, index) => (
              <Typography
                key={index}
                noWrap
                textOverflow="ellipsis"
                title={item}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            py: 2,
            pr: 0.5,
            width: { xs: "60%", md: "40%" },
            // minWidth: 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              bgcolor: "custom.gray",
              borderRadius: "10px",
              p: 0.5,
              boxSizing: "border-box",
              width: "100%",
            }}
          >
            <Typography fontWeight={700} variant="body2">
              卖价：
              {longPrice
                ? `${getPrice(obj.price_min)} - ${getPrice(obj.price_max)}`
                : getPrice(obj.price_sale)}
            </Typography>

            <Typography fontWeight={700} variant="body2">
              进价：{getPrice(obj.price_cost)}
            </Typography>
            <Box sx={{ display: "flex" }}>
              {!obj.is_simple && (
                <Typography
                  fontWeight={700}
                  variant="body2"
                  color="primary.main"
                  sx={{ mr: 1 }}
                >
                  多规格
                </Typography>
              )}
              <Typography fontWeight={700} variant="body2">
                库存：{obj.quantity}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
