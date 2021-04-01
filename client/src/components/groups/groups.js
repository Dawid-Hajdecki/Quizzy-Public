import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from "react-helmet";

import { getAllGroups, getUserGroups, deleteGroup, joinGroup, adminJoinGroup } from '../../actions/groupActions';

import TopNav from '../navbar/TopNav';
import './../../App.scss';
import './style.css'

const Groups = () => {
  const dispatch = useDispatch();
  const history = useHistory();
 
  const groups = useSelector((state) => state.groups);
  const user = useSelector((state) => state.user);
  const allGroups = useSelector((state) => state.allGroups)

  useEffect(() => {
    dispatch(getAllGroups());
    dispatch(getUserGroups(user?.groups));
  },[user])

  const joinGroupHandler = () => {
    dispatch(joinGroup(history));
  }
  const adminJoinGroupHandler = (e) => {
    dispatch(adminJoinGroup(e.target.value, history));
  }

  const deleteHandler = (e) => {
    const id = e.target.value;
    dispatch(deleteGroup(user?._id, id, history));
  }

  const goBack = () => {
    history.push('/');
  }
  return (
    <>
      <TopNav where={"Groups"}/>
      <Helmet>
        <title>Quizzy - Groups</title>
      </Helmet>
      <div className="container mt-4 ">
        <div className="rounded bg-colour col-sm-8 mx-auto p-4" align="center">
          <div className="container">
            <div className="row">
              <div className="col-1">
                <button className="mt-2 backBtn" onClick={goBack}>&#8249;</button>
              </div>
              <div className="col-6">
                <h1>Your Groups</h1>
              </div>
              <div className="col-5">
                <Link to="/groups/create">
                  <button className=" btn btn-primary mx-1 my-1 floatRight">Create Group</button>
                </Link>
                  <button className="btn btn-primary mx-1 my-1 floatRight" onClick={joinGroupHandler}>Join Group</button>
              </div>
            </div>
            <div className={user?.type === "Admin" ? "overflow-250 height-auto" : "overflow-500 height-auto"}>
              {!groups.groupData ? "No Groups Found" : groups.groupData?.map((group, i) => {
                return (  
                  group?.name && (
                    <div key={i} className="container border m-2 group-hover bg-info">
                      <div className="row">
                        {(user?._id !== group?.groupTeacher && user?.type === "Admin") && (
                          <div className="ml-2 mt-1 admin">Admin</div>)
                        }
                        <div className="col">
                          <Link className="colour-black" to={{
                            pathname:`/groups:${group?._id}`
                          }}>
                          
                            <div className="card-body">
                              <h5 className="card-title">{group?.name}</h5>
                              <p className="card-text">{group?.description}</p>
                            </div>
                          
                          </Link>
                        </div>
                        <div className="col">
                          <div className="card-body">
                            { (groups.groupData[i].groupTeacher === user._id || user.type === "Admin") && (
                              <>
                                <button className="btn btn-primary m-1 floatRight" value={group?._id} onClick={deleteHandler}>Delete Group</button>
                                <Link to={{
                                  pathname:`/groups:${group?._id}/edit`,
                                  param1: group
                                }}>
                                  <button className="btn btn-primary m-1 floatRight">Edit Group</button>
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )
              })}
            </div>
          </div>
        </div>
      </div>
      {( allGroups.groupData !== null &&  user?.type === "Admin") &&
            <div className="container mt-4">
                <div className="rounded bg-colour col-lg-8 col-sm-12 mx-auto p-4 min-height-200" align="center">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h2>Groups</h2>
                                <small>Groups that you have not joined yet.</small>
                            </div>
                        </div>
                        <div className="overflow-100 height-auto">
                            <div className="row m-1">
                              {allGroups.groupData.map((oneGroup, i) => {
                                return(
                                  <>
                                    <div class="col-12">
                                      <button value={oneGroup?.name} key={i} className="modal-body m-1 rounded width-100-percentage" onClick={adminJoinGroupHandler}>
                                          {oneGroup?.name}
                                      </button>
                                    </div>
                                  </>
                              )
                              })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
    </>
	);
}

export default Groups;