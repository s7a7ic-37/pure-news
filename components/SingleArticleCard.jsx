const SingleArticleCard = ({ presentArticle }) => {
    const { 
        title, 
        author, 
        topic, 
        created_at, 
        body,
        votes, 
        article_img_url,
        } = presentArticle.article;

    return (
        <>
            <h2 className="article-title">{title}</h2>
            <p className="article-author">Posted by {author}</p>
            <p className="article-topic">{topic}</p>
            <p className="article-date">Posted at {created_at}</p>
            <article className="article-body">{body}</article>
            <img className="article-image" src={article_img_url} alt={title} />
            <p className="article-votes">Votes: {votes}</p>
        </>
    );
}

export default SingleArticleCard;
