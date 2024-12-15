import { useParams } from "react-router-dom";
import Layout from "./Layout";
import SeriesSubmissionForm from "./SeriesSubmissionForm";

function SeriesSubmissionEdit() {
    let { seriesId } = useParams();
    return (
        <Layout>
            <h1>Update Series Submission</h1>
            <SeriesSubmissionForm seriesId={seriesId}/>
        </Layout>
    );
}

export default SeriesSubmissionEdit;
