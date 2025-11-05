import { useState, useEffect } from "react";

const Task = () => {
  const [userData, setUserData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const handleUserData = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await res.json();
    if (data) {
      // setUserData((prevData) => [...prevData, data]);
      setUserData(data);
      //
      setSelectedUserId(data[0].id.toString());
    }
    console.log("user data :", data);
  };
  // const selectedUserData to find the selected user data from userData state
  const selectedUserData = userData.find(
    (user) => user.id.toString() === selectedUserId
  );
  const handleUserSelect = (e) => {
    setSelectedUserId(e.target.value);
  };
  useEffect(() => {
    handleUserData();
  }, []);
  return (
    <div>
      <h1>Select User Name</h1>
      <select value={selectedUserId} onChange={handleUserSelect}>
        {/*  This i was doing in the interview and it is working properly after refreshing the tab  */}
        {userData &&
          userData.map((user) => (
            <option key={user.id} value={user.id.toString()}>
              {user.name}
            </option>
          ))}
      </select>
      {/* This  implementation to show User Data on Select i would do    */}
      {selectedUserData ? (
        <div>
          <h2>User Details: {selectedUserData.name}</h2>
          <p> Email:{selectedUserData.email}</p>
          <p>Phone: {selectedUserData.phone}</p>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default Task;
