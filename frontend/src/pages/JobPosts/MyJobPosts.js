import {useEffect, useRef, useState} from "react";
import "../PostAJob/JobPostingForm.css";
import CoreUICard from "../../components/CoreUICard";
import JobPostCard from "../../components/JobPostCard";
import SearchBar from "../../components/PostingsSearchBar/SearchBar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";

// let loadNum = 1;
function MyJobPosts (props)   {
    // const refCounter = useRef(0);

    var filteredIndicesHashSet = new Set();
    const [data,setData] = useState([{}]); //TODO: REPLACE WITH partialData state hook, directly handled in the filter alg/funciton
    const [defaultData,setDefaultData] = useState([{}]);
    const [searchBarInput, setSearchBarInput] = useState('');

    let [er,setEr] = useState(false);
    let [errorString, setErrorString] = useState("");
    useEffect(() => {

        fetch("/getjob?mapAsFields=true").then(
            response => response.json()
        ).then(
            data => {
                setData(data);
                setDefaultData(data)
                console.log(data);
            }
        ).catch(function(error){
            console.log("empty db", error.toString());
            setErrorString(error.toString())
            setEr(true);
        })

        // if (loadNum === 2){
        //     updateSearchInput("A")
        // }else{
        //     updateSearchInput("A")
        //     updateSearchInput("")
        // }
        // loadNum ^= 0b11;

    },[])


    const updateSearchInput = async (searchBarInput) => {
        /*
        Antoine@ChiefsBestPal
        A bit verbose/complicated, but it is working and sufficiently efficient.
        However, it can / should be scaled and optimized in the near future !
         */
        filteredIndicesHashSet.clear();

        for (let [fieldName,allFieldInstances] of Object.entries(defaultData)) {
            allFieldInstances.forEach(
                (fieldVal,dataIx) => {

                    if (fieldVal != null &&
                        fieldVal.toString().toLowerCase().includes(searchBarInput.toLowerCase()))
                        filteredIndicesHashSet.add(dataIx);
                    if (defaultData.employerUid[dataIx] !== window.localStorage.getItem("uid"))
                        filteredIndicesHashSet.delete(dataIx);

                }
            )
        }



        const filtered = Array.from(Object.values(defaultData)).map(
            row => row.filter(
                (fieldVal,dataIx) => filteredIndicesHashSet.has(dataIx)
            )
        );

        setSearchBarInput(searchBarInput);
        setData( //TODO MAKE MORE EFFICIENT DATA-STRUCTURE WISE... THIS WORKS BUT ITS NOT QUITE SCALABLE
            Object.keys(defaultData).reduce(
                (obj, key, index) => ({ ...obj, [key]: filtered[index] }), {})
        );
        // setPartialData(
        //
        // )
        // console.log("SADSADSADSAD")
        // console.log(filtered)

        document.getElementById("searchResultCount").innerText = "Found " + filteredIndicesHashSet.size + " results";
    }




    if (er || typeof data.id === 'undefined'){ // Json request body not loaded properly if not job post ID
        if (errorString.startsWith("SyntaxError")// || errorString === "SyntaxError: Unexpected token 'P', \"Proxy error\"... is not valid JSON"
        ){
            return (
                <div className="post-comment-container">
                    <header className="Debug-header">
                        <h1> JobPost CRUD Debug Ozan Branch Migrating From Antoine CommentPostBranch </h1>
                    </header>
                    <h1>Job Posts</h1>
                    <div className="job-posts">
                        <p align="center" style={{color: "#FF5733"}}>Your API/backend server is not launched. Please ask an admin to launch the server to use this page.</p>
                    </div>
                </div>
            );
        }
        else{
            return (
                <div className="post-comment-container">
                    <header className="Debug-header">
                        <h1> JobPost CRUD Debug Ozan Branch Migrating From Antoine CommentPostBranch </h1>
                    </header>
                    <h1>Job Posts</h1>
                    <hr/>
                    <h3 align="center" style={{color: "#8B8000"}}>No posts in the job_post table.</h3>
                </div>
            );
        }
    }
    else{
        return (
            <div className="post-comment-container">
                <header className="Debug-header">
                    <h1> JobPost CRUD Debug Ozan Branch Migrating From Antoine CommentPostBranch </h1>
                </header>
                <h1>Job Posts</h1>
                <section style={{display: 'flex', justifyContent:'space-between',alignItems: 'stretch', margin: '1em 0.2em'}}>
                    <span> Search:&ensp; </span>
                    <SearchBar
                        keyword={searchBarInput}
                        setKeyword={updateSearchInput}
                    />
                    &emsp;
                    <FontAwesomeIcon
                        id='postingsFilterButton'
                        style={{cursor: 'pointer'}}
                        icon={faFilter}
                        onClick={(e)=> {alert("Filters are not ready to be implemeted yet! Soon !");}}
                    />

                </section>
                <span style={{display: 'inline-block' ,fontSize: '.9em' , marginTop: "-1rem"}}>
                 <b id="searchResultCount"> Found {(data.id ? data.id.length : 0)} results.</b>

            </span>

                <hr  style={{
                    color: '#000000',
                    backgroundColor: '#000000',
                    height: 5.5,
                    borderColor : '#000000'
                }}/>
                <div className="job-posts">
                    { data.id && data.id.map((id, i)  =>
                    {

                        return (
                        ((window.localStorage.getItem("uid") === data.employerUid[i])) ?

                            <JobPostCard
                                key={i}
                                jobtype={data.jobtype[i]}
                                title={data.title[i]}
                                location={data.location[i]}
                                salary={data.salary[i]}
                                description={data.description[i]}
                                tags={data.tags[i]}
                                id={id}
                                date={new Date(Date.parse(data.date[i])).toLocaleString()}
                                editDate={new Date(Date.parse(data.editDate[i])).toLocaleString()}
                                employerUid={data.employerUid[i]}
                            /> : null
                        )})}
                </div>
            </div>
        );
    }
}

export default MyJobPosts;