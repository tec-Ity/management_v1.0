import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import {
  Box,
  IconButton,
  LinearProgress,
  OutlinedInput,
  // Pagination,
  TablePagination,
  Typography,
} from "@mui/material";
import CusEmptyOverlay from "../overlay/CusEmptyOverlay";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
export default function CusDataGrid({
  columns,
  rows,
  count,
  loading,
  server = "server",
  checkBox = false,
  customId = false,
  defaultPageState = { page: 0, pageSize: 100 },
  onPageStateChange = () => {},
  onSelect = () => {},
  getRowsExtra,
}) {
  const [rowState, setRowState] = React.useState(defaultPageState);

  React.useEffect(() => {
    // rowState.page !== defaultPageState.page &&
    //   rowState.pageSize !== defaultPageState.pageSize &&
    onPageStateChange(rowState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowState]);

  const getDefaultRows = (objs) => {
    // if(getRowsExtra) getRowsExtra(objs);
    return objs
      ? objs.map((obj, index) => ({
          index: index + 1 + rowState.page * rowState.pageSize,
          ...obj,
          ...(getRowsExtra && getRowsExtra(obj)),
          ...{ img_url: obj?.img_xs },
        }))
      : { id: "" };
  };
  // console.log(getDefaultRows(rows));
  return (
    <DataGrid
      sx={{ bgcolor: "custom.white", borderRadius: "10px" }}
      columns={columns}
      rows={getDefaultRows(rows)}
      getRowId={(row) => !customId && row._id}
      // rows={[]}
      {...rowState}
      // rowsPerPageOptions={[5, 10, 30, 50, 100]}
      checkboxSelection={checkBox}
      onSelectionModelChange={(ids) => onSelect(ids)}
      // pagination
      isRowSelectable={() => checkBox}
      disableSelectionOnClick
      paginationMode={server}
      components={{
        LoadingOverlay: LinearProgress,
        NoRowsOverlay: CusEmptyOverlay,
        NoResultsOverlay: CusEmptyOverlay,
        Pagination: CustomPagination,
        // Footer: CustomPagination,
      }}
      // loading
      loading={loading}
      rowCount={count}
      onPageChange={(page) => setRowState((prev) => ({ ...prev, page }))}
      onPageSizeChange={(pageSize) =>
        setRowState((prev) => ({ ...prev, pageSize }))
      }
      componentsProps={{
        pagination: {
          showLastButton: true,
          showFirstButton: true,
          rowCount: count,
          rowsPerPage: rowState.pageSize,
          rowsPerPageOptions: [5, 10, 25, 50, 100],
          page: rowState.page,
          onPageChange: (e, page) => setRowState((prev) => ({ ...prev, page })),
          onRowsPerPageChange: (e) => {
            setRowState((prev) => ({
              ...prev,
              pageSize: parseInt(e?.target?.value, 10),
            }));

            setRowState((prev) => ({ ...prev, page: 0 }));
          },
        },
      }}
    />
  );
}
const FooterComponet = () => {
  return <>1111</>;
};
function CustomPagination(props) {
  const {
    rowCount,
    rowsPerPage,
    rowsPerPageOptions,
    page,
    onPageChange,
    onRowsPerPageChange,
  } = props;
  return (
    <table>
      <tfoot>
        <tr>
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            colSpan={3}
            count={rowCount}
            rowsPerPage={rowsPerPage}
            page={page}
            // SelectProps={{}}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            ActionsComponent={TablePaginationActions}
            showLastButton
            showFirstButton
          />
        </tr>
      </tfoot>
    </table>
  );
}

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;
  const [pageTemp, setPageTemp] = React.useState(page + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {pageTemp !== page + 1 && setPageTemp(page + 1)}, [page]);
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const onPageSelect = (event) => {
    onPageChange(event, pageTemp - 1);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <OutlinedInput
        value={pageTemp}
        size="small"
        sx={{ width: 50, height: 35 }}
        inputProps={{ style: { textAlign: "center" } }}
        onChange={(e) => setPageTemp(e.target.value)}
        onBlur={onPageSelect}
        onKeyDown={(e) => {
          if (e.code === "Enter" || e.code === "NumpadEnter") {
            e.target.blur();
          }
        }}
      />
      <Typography sx={{ ml: 1, display: "inline-flex" }}>
        / {Math.ceil(count / rowsPerPage)}
      </Typography>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

// function CustomPagination(props) {
//   const apiRef = useGridApiContext();
//   const page = useGridSelector(apiRef, gridPageSelector);
//   const pageCount = useGridSelector(apiRef, gridPageCountSelector);
//   console.log(props);
//   return (
//     <Pagination
//       color="primary"
//       count={pageCount}
//       page={page + 1}
//       onChange={(event, value) => apiRef.current.setPage(value - 1)}
//       showFirstButton
//       showLastButton
//     />
//   );
// }
