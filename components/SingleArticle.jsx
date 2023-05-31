import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchArticleById } from "../utils/utils";
import SingleArticleCard from "./SingleArticleCard";

const SingleArticle = () => {
  const [presentArticle, setPresentArticle] = useState({});
  const { article_id } = useParams();

  useEffect(() => {
    fetchArticleById(article_id).then(article => {
        setPresentArticle(article)
    })
  }, [article_id]);

  return (
    <main className="single-article-card">
        <SingleArticleCard presentArticle={ presentArticle }/>
    </main>
  );
};

export default SingleArticle;
