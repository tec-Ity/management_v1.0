import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  selectObjects,
  reSetError,
  setQuery,
  selectObjectsCount,
  selectQuery,
  batchObjects,
} from "../../redux/fetchSlice";
//util
import getPrice from "../../utils/price/getPrice";
//component
// import CusModal from "../modal/CusModal.jsx";
import CusPostModal from "../modal/CusPostModal";
import CusPutModal from "../modal/CusPutModal";
import ErrorSnackBar from "../popover/ErrorSnackBar";
import CusDataGrid from "../dataGrid/CusDataGrid";
import SearchComp from "../search/SearchComp";
import CusListFrontUI from "./CusListFrontUI";
import CusImgViewModal from "../modal/CusImgViewModal";
//mui
import {
  Grid,
  Button,
  Box,
  Typography,
  Tooltip,
  IconButton,
  Fab,
  Menu,
  MenuItem,
  Divider,
  ButtonGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FilterListIcon from "@mui/icons-material/FilterList";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import SortIcon from "@mui/icons-material/Sort";
import CusModal from "../modal/CusModal";
import CusDialog from "../modal/CusDialog";
import ListFilter from "../filter/ListFilter";
import { t } from "i18next";
import DiscountComp from "../discount/DiscountComp";
import { axios_Prom } from "../../api/api";
import prodConf from "../../config/module/prod/prodConf";
import SuccessSnackBar from "../popover/SuccessSnackBar";
import excelToJson from "../../utils/file/excelToJson";
export default function CusItemList({
  formInputs,
  fileInput,
  fetchObjs,
  fetchObj,
  submittedCallback = () => {},
  postDefaultValue,
  actionObjs,
  moreDetails,
  formActionObjs = {}, //{post:{},put:{}}
  dataGridProps = {
    hasImage: false,
    // imageField:'img_urls',
    columns: [],
    getRowsExtra: () => ({}),
  },
  filterOptions,
  CardMB,
  CardImage,
  title,
  showAddNew = true,
  showUpload = false,
  showFilter = true,
  showBatch = false,
  CustomPutModal,
}) {
  //init
  const dispatch = useDispatch();
  const { t } = useTranslation();
  //state
  const [showPostModal, setShowPostModal] = useState(false);
  const [showPutModal, setShowPutModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [buttonAnchor, setButtonAnchor] = useState(null);
  const [anchorType, setAnchorType] = useState(null);
  const [putId, setPutId] = useState("");
  // const [selectedObj, setSelectedObj] = useState(null);
  //selector
  const objects = useSelector(selectObjects(fetchObjs.flag));
  const count = useSelector(selectObjectsCount(fetchObjs.flag));
  const getStatus = useSelector((state) => state.fetch.getStatus);
  const query = useSelector(selectQuery(fetchObjs.flag));
  const errorMsg = useSelector((state) => state.fetch.errorMsg);
  const DNS = useSelector((state) => state.auth.DNS);
  const view = useSelector((state) => state.root.view);
  const isMB = view === "MB";
  const [selectedImageUrl, setSelectedImageUrl] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const allow_Supplier = useSelector(
    (state) => state.auth?.userInfo?.Shop?.allow_Supplier
  );
  //data
  const sortOptions = [
    { label: t("formField.at_upd"), sortKey: "at_upd", width: 80 },
    { label: t("formField.code"), sortKey: "code" },
    { label: t("formField.nome"), sortKey: "nome" },
    ...dataGridProps.columns.map((col) => ({
      label: t(`formField.${col.field}`),
      sortKey: col.field,
      sortType: col.sortType,
    })),
  ];
  //get objects is in the search component
  //func
  const onPageStateChange = (rowState) => {
    const query = { page: rowState.page + 1, pagesize: rowState.pageSize };
    dispatch(setQuery({ fetchObjs, query }));
  };

  const onFilterChange = (query) => {
    console.log("filterChange", query);
    //value: asc:1 ,des:-1
    dispatch(setQuery({ fetchObjs, query }));
    setShowFilterModal(false);
  };

  //effect
  // useEffect(() => {
  //   console.log(1111111111, query);
  //   fetchObjs && query && dispatch(getObjects({ fetchObjs }));
  // }, [dispatch, fetchObjs, query]);

  //clear query
  React.useEffect(() => {
    return () => {
      // console.log('unmount clear query');
      dispatch(setQuery({ fetchObjs, isClear: true }));
    };
  }, []);

  const renderCode = (params) => {
    // console.log(params, allow_Supplier);
    let code = params.value;
    const sup = params?.row?.Supplier?.code;
    if (allow_Supplier && sup) {
      code += `-${sup}`;
    }
    return (
      <Tooltip title={<Typography>{code}</Typography>} placement="top" arrow>
        <Typography noWrap>{code}</Typography>
      </Tooltip>
    );
  };

  const renderName = (params) => (
    <Tooltip
      title={<Typography>{params.value}</Typography>}
      placement="top"
      arrow
    >
      <Typography noWrap>{params.value}</Typography>
    </Tooltip>
  );

  const renderText = (params) => (
    <Typography noWrap title={params.value}>
      {params.value}
    </Typography>
  );
  const renderPrice = (params) => (
    <Typography noWrap title={params.value}>
      {getPrice(params.value)}
    </Typography>
  );

  //init columns
  const baseColumns = [
    {
      field: "index",
      headerName: t("formField.index"),
      width: 60,
    },
    {
      field: "_id",
      headerName: t("general.view"),
      width: 80,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => {
            setPutId(params?.value);
            setShowPutModal(true);
          }}
        >
          {t("general.view")}
        </Button>
      ),
    },

    {
      field: "code",
      headerName: t("formField.code"),
      renderCell: renderCode,
    },
    {
      field: "nome",
      headerName: t("formField.nome"),
      width: 280,
      renderCell: renderName,
    },
    ...dataGridProps.columns.map((col) => ({
      ...col,
      headerName: t(`formField.${col.field}`),
      renderCell: col.renderCell
        ? col.renderCell
        : col.dataType === "price"
        ? renderPrice
        : renderText,
    })),
  ];
  //insert image col
  dataGridProps.hasImage &&
    baseColumns.splice(2, 0, {
      field: "img_url",
      width: 65,
      headerName: t("formField.image"),
      sortable: false,
      renderCell: (params) => {
        return (
          <img
            src={params?.value ? DNS + params?.value : undefined}
            alt=""
            onClick={() =>
              params?.value && setSelectedImageUrl(params.row?.img_url)
            }
            style={{
              height: 45,
              width: 50,
              objectFit: "scale-down",
              cursor: "zoom-in",
            }}
          />
        );
      },
    });
  // console.log(query);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <Grid
          container
          justifyContent="space-between"
          sx={{
            width: "100%",
            height: { xs: actionObjs ? 100 : 70, md: 70 },
            "& > div": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          }}
        >
          {!isMB && (
            <>
              <Grid item xs={1.5}>
                <Typography variant={isMB ? "h6" : "h4"}>
                  {title && t(`nav.${title}`)}
                  {!isMB && t("general.list")}
                </Typography>
              </Grid>
            </>
          )}
          <Grid item xs={8} md={3.5} sx={{ minHeight: 55 }}>
            <SearchComp fetchObjs={fetchObjs} realTime initFetch={isMB} />
          </Grid>
          {[
            {
              show: showAddNew,
              name: "addNew",
              Icon: AddIcon,
              split: showUpload,
              onClick: () => setShowPostModal(true),
              onSplitClick: (e) => {
                setAnchorType("addNew");
                setButtonAnchor(e.currentTarget);
              },
              label: t("general.addNew"),
              size: 1.5,
              extraComp: (
                <AddComp
                  anchorEl={buttonAnchor}
                  open={anchorType === "addNew"}
                  onClose={() => {
                    setButtonAnchor(null);
                    setAnchorType(null);
                  }}
                />
              ),
            },
            {
              show: showFilter,
              name: "filter",
              Icon: FilterListIcon,
              onClick: () => setShowFilterModal(true),
              label: `${t("general.filter")}/${t("general.sort")}`,
              size: 1.5,
            },
            {
              show: showBatch && !isMB,
              name: "batch",
              Icon: ElectricBoltIcon,
              onClick: (e) => {
                setAnchorType("batch");
                setButtonAnchor(e.currentTarget);
              },
              label: t("general.batch"),
              size: 1.5,
              extraComp: (
                <BatchComp
                  anchorEl={buttonAnchor}
                  open={anchorType === "batch"}
                  onClose={() => {
                    setButtonAnchor(null);
                    setAnchorType(null);
                  }}
                  selectedRows={selectedRows}
                />
              ),
            },
          ].map((btnObj) => {
            const {
              show,
              name,
              Icon,
              onClick,
              label,
              size,
              extraComp,
              split,
              onSplitClick,
            } = btnObj;
            return (
              show && (
                <Grid item xs={2} md={1} lg={size || 1} key={label}>
                  {isMB ? (
                    <Fab color="primary" size="medium" onClick={onClick}>
                      <Icon fontSize="large" />
                    </Fab>
                  ) : (
                    <ButtonGroup variant="contained">
                      <Button onClick={onClick}>
                        <Icon />{" "}
                        <Typography
                          sx={{ display: { xs: "none", lg: "inherit" } }}
                        >
                          {" "}
                          {label}
                        </Typography>
                      </Button>
                      {split && (
                        <Button size="small" onClick={onSplitClick}>
                          <ArrowDropDownIcon />
                        </Button>
                      )}
                    </ButtonGroup>
                  )}
                  {extraComp}
                </Grid>
              )
            );
          })}

          {actionObjs && (
            <Grid
              item
              container
              xs={12}
              md={2}
              sx={{
                height: { xs: "fit-content", md: "inherit" },
                zIndex: 9999,
              }}
            >
              {actionObjs.map((action, index) => (
                <Button
                  key={index}
                  variant="contained"
                  {...action.btnProps}
                  onClick={action.onClick ? action.onClick : () => {}}
                >
                  {action.label}
                </Button>
              ))}
            </Grid>
          )}
        </Grid>
        <Box sx={{ flex: 1 }}>
          {isMB ? (
            <CusListFrontUI
              isMB
              back
              cardType="basic"
              objects={objects}
              fetchObjs={fetchObjs}
              onPageStateChange={onPageStateChange}
              handleCardClick={(id) => {
                setPutId(id);
                setShowPutModal(true);
              }}
              CardUI={(props) => {
                const CardUI = CardMB || CardMBDefault;
                return (
                  <CardUI
                    {...props}
                    DNS={DNS}
                    Img={CardImage}
                    handleImageClick={(img_url) => (e) => {
                      e.stopPropagation();
                      img_url && setSelectedImageUrl(img_url);
                    }}
                  />
                );
              }}
            />
          ) : (
            <CusDataGrid
              columns={baseColumns}
              rows={objects}
              getRowsExtra={dataGridProps?.getRowsExtra}
              onPageStateChange={onPageStateChange}
              count={count}
              loading={getStatus === "loading"}
              checkBox
              onSelect={(ids) => setSelectedRows(ids)}
            />
          )}
        </Box>
      </Box>
      {/* filter modal */}
      <FilterDialog
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        query={query}
        sortOptions={sortOptions}
        filterOptions={filterOptions}
        onFilterChange={onFilterChange}
      />

      <CusPostModal
        fullScreen={isMB}
        open={showPostModal}
        onClose={() => setShowPostModal(false)}
        fetchObj={fetchObj}
        title={"新建" + t(`nav.${title}`)}
        formInputs={formInputs}
        fileInput={fileInput}
        submittedCallback={submittedCallback}
        defaultValue={postDefaultValue}
        actions={formActionObjs["post"]}
      />
      {putId &&
        (CustomPutModal ? (
          <CustomPutModal
            objectId={putId}
            open={showPutModal}
            onClose={() => {
              setShowPutModal(false);
              setPutId(null);
            }}
            fullScreen={isMB}
          />
        ) : (
          <CusPutModal
            fullScreen={isMB}
            justifyAction={isMB && "flex-start"}
            open={showPutModal}
            onClose={() => {
              setShowPutModal(false);
              setPutId(null);
            }}
            title={t(`nav.${title}`) + "详情"}
            fetchObj={fetchObj}
            objectId={putId}
            formInputs={formInputs}
            fileInput={fileInput}
            moreDetails={moreDetails}
            actions={formActionObjs["put"]}
            initObject={
              putId ? objects?.find((obj) => obj._id === putId) : null
            }
            initFetch={!isMB}
          />
        ))}
      <CusImgViewModal
        // key={selectedImageUrl}
        open={selectedImageUrl?.length > 0}
        onClose={() => setSelectedImageUrl([])}
        img_url={selectedImageUrl}
      />
      <ErrorSnackBar
        error={errorMsg?.split("]")[1]}
        onClose={() => dispatch(reSetError())}
      />
    </>
  );
}

const CardMBDefault = ({ obj, DNS, Img, handleImageClick }) => {
  const { t } = useTranslation();
  return (
    <Grid container columnSpacing={1} sx={{ p: 1 }}>
      <Grid item xs={3}>
        {obj?.img_xs ? (
          <Box
            component="img"
            src={DNS + obj.img_xs}
            sx={{ width: "100%", height: 80, objectFit: "scale-down" }}
            onClick={handleImageClick(obj.img_url)}
          />
        ) : (
          <Img sx={{ width: "100%", height: 80, objectFit: "scale-down" }} />
        )}
      </Grid>
      <Grid container item xs={9}>
        <Grid item xs={12}>
          <Typography noWrap>
            {t("formField.code")}:&nbsp;{obj.code}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography noWrap>
            {t("formField.nome")}:&nbsp;{obj.nome}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

const FilterDialog = ({
  open,
  onClose,
  query,
  sortOptions,
  filterOptions,
  onFilterChange,
}) => (
  <CusDialog
    dividers
    size="md"
    title={`${t("general.filter")}/${t("general.sort")}`}
    open={open}
    onClose={onClose}
    showCloseIcon={false}
    content={
      <ListFilter
        query={query}
        sortOptions={sortOptions}
        filterOptions={filterOptions}
        onChange={onFilterChange}
      />
    }
  />
);

const BatchDiscount = ({ selectedRows, handleBatch }) => {
  const [percentOff, setPercentOff] = useState(0);
  const handleChange = () => {
    console.log(percentOff);
    // const disRes = await axios_Prom("/price_sale_Prod_percent", "POST", {
    //   percent: (1 - percentOff) * 100,
    //   Prod_ids: selectedRows,
    // });
    handleBatch({
      fetchObjs: { ...prodConf.fetchObjs, api: "/price_sale_Prod_percent" },
      method: "POST",
      data: { percent: (1 - percentOff) * 100, Prod_ids: selectedRows },
      resDataField: "Prods",
      modifiedField: "price_sale",
    });
  };
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <DiscountComp percentMode onChange={(pf) => setPercentOff(pf)} />
      <Button variant="contained" onClick={handleChange} sx={{ mt: 3 }}>
        {t("general.confirm")}
      </Button>
    </Box>
  );
};

const batchOps = [
  { label: "批量折扣", field: "discount", Component: BatchDiscount },
];

const BatchComp = ({ anchorEl, open, onClose, selectedRows }) => {
  const dispatch = useDispatch();
  const batchStatus = useSelector((state) => state.fetch.batchStatus);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState(null);

  React.useEffect(() => {
    if (submitted && batchStatus === "succeed") {
      // setSubmitted(false);
      onClose();
    }
  }, [batchStatus, submitted]);

  const handleBatch = ({
    fetchObjs,
    method,
    data,
    selection = true,
    resDataField,
    modifiedField,
  }) => {
    dispatch(
      batchObjects({
        fetchObjs,
        method,
        data,
        selection,
        resDataField,
        modifiedField,
      })
    );
    setSubmitted(true);
  };

  return (
    <>
      <Menu anchorEl={anchorEl} open={open} onClose={onClose} sx={{ mt: 0.5 }}>
        {batchOps.map((op) => {
          const { label, field, Component } = op;
          return (
            <MenuItem
              key={field}
              onClick={() => {
                if (!selectedRows?.length > 0) {
                  setError("请选择想要操作的行");
                } else setType(field);
              }}
            >
              {label}
              <Box onClick={(e) => e.stopPropagation()}>
                <CusDialog
                  size="sm"
                  open={type === field}
                  onClose={() => setType(null)}
                  title={label}
                  content={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Component
                        selectedRows={selectedRows}
                        onClose={() => setType(null)}
                        handleBatch={handleBatch}
                      />
                    </Box>
                  }
                />
              </Box>
            </MenuItem>
          );
        })}
        {/* <MenuItem onClick={()=>}></MenuItem>
        <MenuItem>批量删除</MenuItem>
        <Divider />
        <MenuItem disabled>批量修改</MenuItem>
        <MenuItem>-库存</MenuItem> */}
      </Menu>
      <ErrorSnackBar error={error} onClose={() => setError(null)} />
      <SuccessSnackBar
        msg={submitted && batchStatus === "succeed" && "修改成功"}
        onClose={() => {
          // console.log(11111111111);
          setSubmitted(false);
        }}
      />
    </>
  );
};

const AddComp = ({ anchorEl, open, onClose }) => {
  const [showImport, setShowImport] = useState(false);
  const handleUpload = (e) => {
    console.log(e.target.files);
    let file = e.target.files[0];
    excelToJson(file, (result) => console.log(result));
  };
  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        sx={{ mt: 0.5 }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          // vertical: "bottom",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={() => setShowImport(true)}>批量上传</MenuItem>
      </Menu>
      <CusDialog
        title="批量上传"
        open={showImport}
        onClose={() => {
          setShowImport(false);
          onClose();
        }}
        content={
          <Button variant="contained" component="label">
            选择文件（）
            <input
              hidden
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              type="file"
              onChange={handleUpload}
            />
          </Button>
          // <Button variant="contained" component="label">
          //   Upload
          //   <input hidden accept="image/*" multiple type="file" />
          // </Button>
        }
      />
    </>
  );
};
