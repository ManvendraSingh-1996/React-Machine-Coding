import { useState, useEffect } from "react";
import { useDebounce } from "../Hooks/useDebounce";
const Task = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [searchInput, setSearchInput] = useState("");
  // const [filteredUser, setFilteredUser] = useState([]);
  const debouncedValue = useDebounce(searchInput, 500);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await res.json();
      const userData = data;
      setUser(userData);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleUserChange = (e) => {
    const selecteduser = e.target.value;
    const filteredUser = userData.find((x) => x.name == selecteduser);
    setSelectedUser(filteredUser);
    console.log(filteredUser);
  };
  const handleChange = (e) => {
    const value = e.target.value;
    // if (value.length === 0 || null) {
    //   setFilteredUser([]);
    // }
    setSearchInput(value);
    // const users = userData.filter((user) => {
    //   return user.name.toLowerCase().includes(value.toLowerCase());
    // });
    // setFilteredUser(users);
  };
  const filteredUser = userData.filter((user) => {
    if (!debouncedValue || debouncedValue.length < 1) {
      return false;
    }
    return user.name.toLowerCase().includes(debouncedValue.toLowerCase());
  });
  return (
    <>
      <div className="App">
        {/* <h3>Select User Name from Dropdown</h3> */}
        <div>
          {loading === true ? (
            <div>Loading</div>
          ) : (
            <div>
              <label htmlFor="users">Select User for details:</label>
              <select name="users" id="users" onChange={handleUserChange}>
                <option>Select User</option>
                {userData &&
                  userData?.map((user) => (
                    <option key={user.id} value={user.name}>
                      {user.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <div>
            <h4>Selected User Details</h4>
            <div>
              {selectedUser && (
                <ol>
                  <li>{selectedUser.username}</li>
                  <li>{selectedUser.email}</li>
                  <li>{selectedUser.website}</li>
                </ol>
              )}
            </div>
          </div>
        </div>
        <div>
          <h4>Search for User</h4>
          <input type="text" value={searchInput} onChange={handleChange} />
        </div>
        {filteredUser.length > 0 &&
          filteredUser?.map((user) => <div key={user.id}>{user.name}</div>)}
        {/* <Accordian /> */}
      </div>
    </>
  );
};

export default Task;
