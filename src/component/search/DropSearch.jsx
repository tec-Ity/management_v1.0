import React, { useState } from "react";
import SearchComp from "./SearchComp.jsx";
//mui
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  ClickAwayListener,
  Paper,
  Typography,
} from "@mui/material";
import { selectObjects } from "../../redux/fetchSlice.js";
import { useSelector } from "react-redux";
import SearchInput from "./SearchInput.jsx";

const RESULT_QUANTITY = 5;
export default function DropSearch({
  fetchObjs,
  isSimple,
  objects: propsObjects,
  CusItemRow,
  itemRowHeight = 55,
  onSelect = () => {},
  onKeyDown = () => {},
  pagesize = RESULT_QUANTITY,
  realTime = true,
  inputStyle = {},
  ...rest
}) {
  const selectorObjects = useSelector(selectObjects(fetchObjs?.flag));
  const [searchInputKey, setSearchInputKey] = useState(0);
  const objects = propsObjects || selectorObjects;
  const DNS = useSelector((state) => state.auth.DNS);
  const [showDrop, setShowDrop] = useState(false);
  const onClose = () => setShowDrop(false);
  const onSelectSelf = (obj) => () => {
    setShowDrop(false);
    onSelect(obj);
    setSearchInputKey((prev) => prev + 1);
  };
  // console.log(111111, objects);
  return (
    <ClickAwayListener onClickAway={onClose}>
      <Box sx={{ position: "relative", zIndex: 99, width: "100%" }}>
        <>
          <Box sx={{ width: "100%" }} onClick={() => setShowDrop(true)}>
            {isSimple ? (
              <SearchInput
                key={searchInputKey}
                handleChange={(code) => setShowDrop(Boolean(code))}
                handleKeyDown={onKeyDown}
                {...rest}
              />
            ) : (
              <SearchComp
                fetchObjs={fetchObjs}
                realTime={realTime}
                query={{ pagesize }}
                onChangeCB={(code) => setShowDrop(Boolean(code))}
                style={inputStyle}
                handleKeyDown={onKeyDown}
                {...rest}
              />
            )}
          </Box>
          <Box
            component={Paper}
            sx={{
              p: 1,
              position: "absolute",
              width: "98%",
              borderRadius: "10px",
              overflowY: "scroll",
              "&::-webkit-scrollbar": { display: "none" },
              "&::-ms-overflow-style": "none",
              scrollbarWidth: "none",
              transition: "0.2s",
              height:
                showDrop && objects?.length > 0
                  ? objects?.length > pagesize
                    ? itemRowHeight * pagesize
                    : itemRowHeight * objects?.length
                  : 0,
              opacity: showDrop && objects?.length > 0 ? 1 : 0,
            }}
          >
            {objects?.slice(0, 5)?.map((obj) => (
              <Card key={obj._id} onClick={onSelectSelf(obj)} sx={{ mb: 1 }}>
                <CardActionArea>
                  {CusItemRow ? (
                    <CusItemRow obj={obj} />
                  ) : (
                    <Box sx={{ display: "flex", width: "100%" }}>
                      {obj.img_xs && (
                        <CardMedia
                          component="img"
                          image={DNS + obj.img_xs}
                          sx={{
                            display: "block",
                            height: 50,
                            width: 50,
                            objectFit: "scale-down",
                          }}
                        />
                      )}
                      <Box sx={{ width: "80%" }}>
                        <Typography noWrap>{obj.nome}</Typography>
                        <Typography noWrap>{obj.nomeTR}</Typography>
                        <Typography noWrap>{obj.code}</Typography>
                      </Box>
                    </Box>
                  )}
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </>
      </Box>
    </ClickAwayListener>
  );
}
