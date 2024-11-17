
function LoadMoreButton({ loadMore }) {
    return (
        <div className="btn-group"style={{marginTop: '1vw'}}>
            <button className="btn btn-default btn-ghost" onClick={loadMore}>
                Load more
            </button>
        </div>
    );
}

export default LoadMoreButton;
