import { useEffect, useState } from "react";
import Axios from "axios";

function App() {
//State
  const [notes, setNotes] = useState(null);
  const [createForm, setCreateForm] = useState({
    title: "",
    content: ""
  });
  const [updateForm, setUpdateForm] = useState({
    _id: null,
    title: "",
    content: ""
  });

//Use effect
  useEffect(() =>{
    fetchNotes(); 
  }, []);

//Function
  const fetchNotes = async () => {
    //Fetch the notes
    const res = await Axios.get('http://localhost:3001/notes');
    //Set to state
    setNotes(res.data.notes);
  };

 //ci permette di scrivere dentri input e text area di create
  const updateCreateFromField = (event) => {
    const {name, value} = event.target;

    setCreateForm({
      ...createForm,
      [name]: value
    });
  };

  const createNote = async (event) => {
  event.preventDefault();
  //Create Note
   const res = await Axios.post('http://localhost:3001/notes', createForm);
  //Update state
  setNotes([...notes, res.data.note]);
  //CLear form satate
  setCreateForm({
    title:"",
    content:""
  })
  };

  const deleteNote = async (_id) => {
   //Delete the note
   const res = await Axios.delete(`http://localhost:3001/notes/${_id}`);
   //update state
   const newNotes = [...notes].filter(note => {
    return note._id !== _id;
   });
   setNotes(newNotes);
  };

  //ci permette di scrivere dentro input e text area di update
  const handleUpdateFieldChange = (event) => {
    const {name, value} = event.target;

    setUpdateForm({
      ...updateForm,
      [name]: value
    });
  };

  const toggleUpdate = (note) => {
    //Set state on update form
    setUpdateForm({title: note.title, content: note.content, _id: note._id});
    
  };

  const updateNote = async (event) => {
    event.preventDefault();
    const {title, content} = updateForm;
    //Send the update request
    const res = await Axios.put(`http://localhost:3001/notes/${updateForm._id}`, {title, content})
    //Update state
    const newNotes = [...notes];
    const noteIndex = notes.findIndex(note =>{
      return note._id === updateForm._id;
    });
     newNotes[noteIndex] = res.data.note;
     setNotes(newNotes);

     //Clear update form state
     setUpdateForm({
      _id: null,
      title: "",
      content: ""
     })
  };

  return (
    <div className="App">
      <div>
        <h2>Notes:</h2>
        {notes && notes.map((note) =>{
          return(
            <div key={note._id}>
              <h3>{note.title}</h3>
              <h3>{note.content}</h3>
              <button onClick={() => deleteNote(note._id)}>Delete Note!</button>
              <button onClick={() => toggleUpdate(note)}>Update!</button>
            </div>
          );
        })}
      </div>

      {updateForm._id &&(
      <div>
        <h2>Update Note</h2>
        <form onSubmit={updateNote}>
          <input 
           onChange={handleUpdateFieldChange} 
           value={updateForm.title} 
           name="title"
           />
          <textarea 
           onChange={handleUpdateFieldChange} 
           value={updateForm.content} 
           name="content"
           />   
          <button type="submit">Update!</button>
        </form>
      </div>
      )}

      {!updateForm._id && (
        <div>
        <h2>Create Note:</h2>
        <form onSubmit={createNote}>
         <input 
          onChange={updateCreateFromField}
          value={createForm.title}
          name="title"  
          />
          <textarea 
          onChange={updateCreateFromField}
          value={createForm.content}
          name="content"  
          />
          <button type="submit">CreateNote</button>
        </form>
      </div>
      )}
    </div>
  );
}

export default App;
