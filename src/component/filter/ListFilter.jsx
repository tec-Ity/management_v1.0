import { Button, Grid, Typography } from "@mui/material";
import { t } from "i18next";
import React, { useState } from "react";
import CusButtonGroup from "../buttonGroup/CusButtonGroup.jsx";
import FormItem from "../form/FormItem.jsx";
export default function ListFilter({
  query,
  sortOptions,
  filterOptions,
  onChange = () => {},
}) {
  // console.log(query);
  const {
    sortKey: sk,
    sortVal: sv,
    //unnecessary
    page,
    pageSize,
    search,
    // other
    ...rest
  } = query;
  // console.log(sortOptions);
  const [filterParam, setFilterParam] = useState({ ...rest });
  const [sortKey, setSortKey] = useState(sk || sortOptions[0]?.sortKey);
  const [sortVal, setSortVal] = useState(sv || -1);
  console.log(filterParam);
  //sortOptions
  const validOptions = [];
  sortOptions?.forEach(
    (op) =>
      op.sortType !== "none" && validOptions.push({ ...op, value: op.sortKey })
  );
  //sort sortKey
  const curSortObj = sortOptions.find((op) => op.sortKey === sortKey);
  const fieldType = curSortObj.sortType;
  console.log(sortKey, fieldType, sortVal);
  //func
  const handleChange = () => {
    onChange({ sortKey, sortVal, ...filterParam });
  };
  return (
    <Grid container item rowGap={3}>
      {/* sort sortKey */}
      <Grid item xs={9}>
        <Typography sx={{ mb: 1 }}>排序项</Typography>
        <CusButtonGroup
          initValue={sortKey}
          size="small"
          buttonObjs={validOptions}
          handleChange={(sortKey) => setSortKey(sortKey)}
        />
      </Grid>
      {/* sort sortVal */}
      {!fieldType && (
        <Grid item xs={3}>
          <Typography sx={{ mb: 1 }}>排序方式</Typography>
          <CusButtonGroup
            initValue={sortVal}
            size="small"
            buttonObjs={[
              { label: t("general.descending"), sortVal: -1 },
              { label: t("general.ascending"), sortVal: 1 },
            ]}
            handleChange={(sortVal) => setSortVal(sortVal)}
          />
        </Grid>
      )}
      {/* filters */}
      {filterOptions && (
        <Grid
          container
          item
          xs={12}
          columnSpacing={3}
          rowSpacing={1}
          alignItems="flex-end"
        >
          <Grid item xs={12}>
            <Typography>筛选项</Typography>
          </Grid>
          {filterOptions?.map((fOp) => {
            const { label, field, dataType, inputProps } = fOp;
            const { itemType, ...restProps } = inputProps;
            return (
              <Grid key={field} container item xs={12} md={4} lg={3}>
                {/* <Typography>{t(`formField.${label}`)}</Typography> */}
                <FormItem
                  label={t(`formField.${label}`)}
                  itemType={itemType}
                  value={filterParam[field] || ""}
                  field={field}
                  {...restProps}
                  handleChange={(value) =>
                    setFilterParam((prev) => ({
                      ...prev,
                      [field]: value || "",
                    }))
                  }
                  sx={{ width: "100%" }}
                />
              </Grid>
            );
          })}
        </Grid>
      )}

      <Grid item xs={12}>
        <Button variant="contained" onClick={handleChange}>
          {t("general.confirm")}
        </Button>
      </Grid>
    </Grid>
  );
}
