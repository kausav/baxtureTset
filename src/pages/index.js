import { useState, useEffect } from "react";
import api from "../services/api";
import Select from "react-dropdown-select";
import { Toaster, toast } from "react-hot-toast";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [age, setAge] = useState(1);
  const [hobbies, setHobbies] = useState([]);
  const [values, setValues] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [showDiv, setShowDiv] = useState(false);

  const clearData = () => {
    setUserName("");
    setAge(1);
    setHobbies([]);
    setUsers([]);
    setUserId("");
    setValues([]);
    setShowDiv(!showDiv);
  };
  const handleChange = (event) => {
    if (event.target.name === "age") {
      setAge(parseInt(event.target.value));
    }
    if (event.target.name === "userName") {
      setUserName(event.target.value);
    }
  };
  const handleMultiSelectChange = (values) => {
    if (values && values.length > 0) {
      let data = values.map((m) => {
        return m.value;
      });
      setHobbies(data);
      setValues(values);
    }
  };

  const createUser = async () => {
    try {
      let data = await api.post("/users", { userName, age, hobbies });
      if (data.data.statusCode === 200) {
        toast.success(data.data.message);
        clearData();
        window.location.reload();
      } else {
        throw new Error(data.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getUsers = async () => {
    try {
      let data = await api.get("/users");
      if (data.data.statusCode === 200) {
        toast.success(data.data.message);
        setUsers(data.data.data);
      } else {
        throw new Error(data.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getUserById = async (id) => {
    try {
      let data = await api.get(`/users/${id}`);
      if (data.data.statusCode === 200) {
        toast.success(data.data.message);
        setUserName(data.data.data.userName);
        setAge(data.data.data.age);
        setUserId(data.data.data._id);
        let hobbies = [];
        if (data.data.data.hobbies.length > 0) {
          data.data.data.hobbies.forEach((h) => {
            hobbies.push({ label: h, value: h });
          });
        }
        setValues(hobbies);
        setShowDiv(true);
      } else {
        throw new Error(data.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateUser = async () => {
    try {
      let data = await api.put(`/users/${userId}`, { userName, age, hobbies });
      if (data.data.statusCode === 200) {
        toast.success(data.data.message);
        clearData();
        window.location.reload();
      } else {
        throw new Error(data.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteUser = async (id) => {
    try {
      let data = await api.delete(`/users/${id}`);
      if (data.data.statusCode === 200) {
        toast.success(data.data.message);
        clearData();
        window.location.reload();
      } else {
        throw new Error(data.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(async () => {
    await getUsers();
  }, []);

  return (
    <div>
      <Toaster position="bottom-center" />
      {showDiv ? (
        <div>
          <p>{userId ? "Edit" : "Add"} User</p>
          <br></br>
          Username* :{" "}
          <input
            type="text"
            name="userName"
            value={userName}
            onChange={handleChange}
          ></input>
          <br></br>
          Age*:{" "}
          <input
            type="number"
            name="age"
            value={age}
            onChange={handleChange}
            min="1"
          ></input>
          <br></br>
          Hobbies:{" "}
          <Select
            isMulti
            create="true"
            placeholder="Add Hobbies"
            clearOnSelect
            multi="true"
            clearable="true"
            searchBy="label"
            closeOnSelect
            values={values}
            onChange={(values) => {
              handleMultiSelectChange(values);
            }}
          />
          <button
            onClick={() => {
              if (userId) {
                updateUser();
              } else {
                createUser();
              }
            }}
          >
            Submit
          </button>
        </div>
      ) : null}
      <button
        onClick={() => {
          setShowDiv(!showDiv);
        }}
      >
        {showDiv ? "-" : "+"}
      </button>
      <div>
        <table>
          <thead>
            <th>Name</th>
            <th>Age</th>
            <th>Hobbies</th>
            <th>Action</th>
          </thead>
          <tbody>
            {users.length > 0
              ? users.map((el, i) => {
                  return (
                    <>
                      <tr key={i}>
                        <td>{el.userName}</td>
                        <td>{el.age}</td>

                        <td>
                          <span>{el.hobbies.join(", ")}</span>
                        </td>
                        <td>
                          <button
                            title="Edit User"
                            onClick={() => {
                              getUserById(el._id);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            title="Delete User"
                            onClick={() => {
                              deleteUser(el._id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </>
                  );
                })
              : ""}
          </tbody>
        </table>
      </div>
    </div>
  );
}
