
function PaginationButtons({ previousPage, nextPage }) {
    return (
        <div className="btn-group"style={{marginTop: '1vw'}}>
            <button className="btn btn-default btn-ghost" onClick={previousPage}>
                Previous
            </button>
            <button className="btn btn-default btn-ghost" onClick={nextPage}>
                Next
            </button>
        </div>
    );
}

export default PaginationButtons;
