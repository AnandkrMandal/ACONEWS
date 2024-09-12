import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

import { CardBody as MtCardBody } from "@material-tailwind/react";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded";
import { Button, Pagination } from "@mui/material";
import Divider from '@mui/material/Divider';
import _ from "lodash"; 




const SyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
  },
}));

const SyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  flexGrow: 1,
  "&:last-child": {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  marginBottom: "8px",
});

function Author({ authors, publish }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 16px",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center" }}>
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar key={index} alt={author.name} src={author.avatar} sx={{ width: 24, height: 24 }} />
          ))}
        </AvatarGroup>
        <Typography variant="caption">
          {authors.map((author) => author.name).join(", ")}
        </Typography>
      </Box>
      <Button sx={{}}>Read More</Button>
      <Typography variant="caption">{new Date(publish).toLocaleDateString()}</Typography>
    </Box>
  );
}

Author.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  publish: PropTypes.string.isRequired,
};

export function Search({ handleSearch }) {
  const [query, setQuery] = useState("");

  const debouncedSearch = useCallback(
    _.debounce((q) => {
      handleSearch(q);
    }, 500),
    []
  );

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <FormControl sx={{ width: { xs: "100%", md: "25ch" } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Search…"
        value={query}
        onChange={handleInputChange}
        startAdornment={
          <InputAdornment position="start" sx={{ color: "text.primary" }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{ "aria-label": "search" }}
      />
    </FormControl>
  );
}

function ContentCard({ img, title, desc }) {
  return (
    <Card
      key={title}
      className="relative grid min-h-[30rem] items-end overflow-hidden rounded-xl"
      color="transparent"
    >
      <img
        src={img}
        alt="bg"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/70" />
      <MtCardBody className="relative flex flex-col justify-end">
        <Typography variant="h4" color="white">
          {title}
        </Typography>
        <Typography
          variant="paragraph"
          color="white"
          className="my-2 font-normal"
        >
          {desc}
        </Typography>
        <Button>Read More</Button>
      </MtCardBody>
    </Card>
  );
}


export default function NewsContent() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("none");
  const [focusedCardIndex, setFocusedCardIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

  const categories = ["general", "business", "technology", "entertainment", "sports", "science", "health"];
  const pageSize = 10; 

  const apiKey = import.meta.env.VITE_API_KEY;

  const fetchNewsData = async (query = "", page = 1) => {
    setLoading(true);
    const searchParam = query ? `search?q=${query}&` : `top-headlines?category=${category}&`;
    const url = `https://gnews.io/api/v4/${searchParam}lang=en&country=us&max=${pageSize}&page=${page}&apikey=${apiKey}`; 
    try {
      const response = await fetch(url);
      const data = await response.json();
      setNewsData(data.articles || []);
      setTotalArticles(data.totalArticles || 0);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching news data:", error);
    }
  };

  useEffect(() => {
    fetchNewsData("", currentPage); 
  }, [category, currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); 
    fetchNewsData(query, 1);
  };

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    fetchNewsData(searchQuery, value);
  };

  return (
    <>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Category Filter */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          width: "100%",
          justifyContent: "space-between",
          alignItems: { xs: "start", md: "center" },
          gap: 4,
          overflow: "auto",
        }}
      >
        <Box sx={{ display: "inline-flex", flexDirection: "row", gap: 3, overflow: "auto" }}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              onClick={() => setCategory(cat)}
              size="medium"
              label={cat.charAt(0).toUpperCase() + cat.slice(1)}
              className={`px-4 py-2 rounded-md ${category === cat ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            />
          ))}
        </Box>

        <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "row", gap: 1, width: { xs: "100%", md: "fit-content" }, overflow: "auto" }}>
          <Search handleSearch={handleSearch} />
          <IconButton size="small" aria-label="RSS feed">
            <RssFeedRoundedIcon />
          </IconButton>
        </Box>
      </Box>

      {/* News Grid */}
      <Grid container spacing={2} columns={12}>
        {newsData.map((news, index) => (
          <Grid key={index} item xs={12} md={6}>
            <SyledCard
              variant="outlined"
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              tabIndex={0}
              className={focusedCardIndex === index ? "Mui-focused" : ""}
            >
              <CardMedia
                component="img"
                alt={news.title}
                image={news.image}
                sx={{ borderBottom: "1px solid", borderColor: "divider", borderRadius: "12px 12px 0 0", objectFit: "cover", height: "200px" }}
              />
              <SyledCardContent>
                <Typography gutterBottom variant="caption" component="div">
                  {news.source.name}
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  {news.title}
                </Typography>
                <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                  {news.description}
                </StyledTypography>
              </SyledCardContent>
              
              <Author authors={news.authors || []} publish={news.publishedAt} />
            </SyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(totalArticles / pageSize)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ alignSelf: "center", marginTop: 2 }}
      />
    </Box>

    <section className="container mx-auto  py-10 lg:py-28">
      {/* Heading */}
      <Typography
        variant="h2"
        color="blue-gray"
        className="!text-2xl pb-2 !leading-snug lg:!text-3xl"
      >
        Top Headlines
      </Typography>
      <Divider />

      {/* Category Selection Bar */}
      <div className="flex justify-start mt-5  overflow-x-scroll no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 mx-2 py-2 rounded-full ${
              category === cat ? "bg-orange-700 text-white" : "bg-gray-200"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Display Articles */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {newsData.length > 0 ? (
          newsData.map(({ title, description, image }) => (
            <ContentCard key={title} img={image} title={title} desc={description} />
          ))
        ) : (
          <p className="text-center">No articles found for this category.</p>
        )}
      </div>

      {/* Pagination */}
      {totalArticles > pageSize && (
        <div className="flex justify-center mt-10">
          <Pagination
            count={Math.ceil(totalArticles / pageSize)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      )}
    </section>
    </>
  );
}
