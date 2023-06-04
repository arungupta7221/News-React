import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Loader from "./Loader";
import InfiniteScroll from "react-infinite-scroll-component";
// import PropTypes from "prop-types";
const News = (props) => {
  // for class based component------------

  // static defaultProps = {
  //   country: "in",
  //   pageSize: 9,
  //   category: "general",
  // };

  // static PropTypes = {
  //   country: PropTypes.string,
  //   pageSize: PropTypes.number,
  // };

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  // document.title = `NewsMonekey-${this.capitalizeFirstLetter(
  //   props.category
  // )}`;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async (pageNo) => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${props.category}&apiKey=${props.apiKey}&page=${
      page + pageNo
    }&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(40);
    let parseData = await data.json();
    props.setProgress(70);
    setArticles(parseData.articles);
    setPage(page + pageNo);
    setTotalResults(parseData.totalResults);
    setLoading(false);
    props.setProgress(100);
  };
  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews(0);
  }, []);

  // handleNextClick = async () => {
  //   let url = `https://newsapi.org/v2/top-headlines?country=${
  //     props.country
  //   }&category=${
  //     props.category
  //   }&apiKey=2b13f4291c504153b5d33eba3da01eae&page=${
  //     this.state.page + 1
  //   }&pageSize=${props.pageSize}`;
  //   this.setState({
  //     loading: true,
  //   });
  //   let data = await fetch(url);
  //   let parseData = await data.json();
  //   console.log(parseData);
  //   this.setState({
  //     pageNumber: this.state.pageNumber + 1,
  //     articles: parseData.articles,
  //     loading: false,
  //   });
  // await this.updateNews();
  // };

  // handlePrevClick = async () => {
  //   let url = `https://newsapi.org/v2/top-headlines?country=${
  //     props.country
  //   }&category=${
  //     props.category
  //   }&apiKey=2b13f4291c504153b5d33eba3da01eae&page=${
  //     this.state.page - 1
  //   }&pageSize=${props.pageSize}`;
  //   this.setState({
  //     loading: true,
  //   });
  //   let data = await fetch(url);
  //   let parseData = await data.json();
  //   this.setState({
  //     page: this.state.page - 1,
  //     articles: parseData.articles,
  //     loading: false,
  //   });

  //   // await this.updateNews();
  // };

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${props.category}&apiKey=${props.apiKey}&page=${
      page + 1
    }&pageSize=${props.pageSize}`;
    setPage(page + 1);
    let data = await fetch(url);
    let parseData = await data.json();
    setArticles(articles.concat(parseData.articles));
    setTotalResults(parseData.totalResults);
  };

  return (
    <>
      <h1 className="text-center" style={{ margin: "35px", marginTop: "95px" }}>
        NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      {loading && <Loader />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Loader />}
      >
        <div className="container">
          <div className="row">
            {articles.map((Element) => {
              return (
                <div className="col-md-4" key={Element.url}>
                  <NewsItem
                    title={
                      Element.title ? Element.title.slice(0, 45) : Element.title
                    }
                    description={
                      Element.description
                        ? Element.description.slice(0, 88)
                        : Element.description
                    }
                    imageUrl={Element.urlToImage}
                    newsUrl={Element.url}
                    author={Element.author}
                    date={Element.publishedAt}
                    source={Element.source.name}
                  />
                </div>
              );
            })}
            ;
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 9,
  category: "general",
};
export default News;
