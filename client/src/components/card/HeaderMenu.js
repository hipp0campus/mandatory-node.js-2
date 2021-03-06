import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  position: absolute;
  top: 32px;
  right: 12px;

  box-sizing: border-box;
  border: 1px solid black;
  border-radius: 4px;
  background-color: #f1f3f5;

  z-index: 1;

  .options,
  .delete {
    cursor: pointer;
    padding: 4px 6px;
  }
`;

export default function HeaderMenu({ onDisplayEdit, displayEditIcon, onDisplayMenu, workoutID, setWorkouts, workouts }) {
  function onDelete() {
    axios.delete(`/workouts/delete/${workoutID}`)
    .then(result => {
      onDisplayMenu();
      
      let workoutsCopy = [...workouts];
      let updatedWorkouts = workoutsCopy.filter(workout => workout._id !== workoutID);
      setWorkouts(updatedWorkouts);
    })
    .catch(err => console.log(err));
  }

  function onEdit() {
    if (!displayEditIcon) {
      onDisplayEdit(workoutID);
    } else {
      onDisplayEdit('');
    }
    
    onDisplayMenu();
  }

  return (
    <Container>
      <div className="options" onClick={onEdit}>Exercises options</div>
      <div className="delete" onClick={onDelete}>Delete workout</div>
    </Container>
  )
}
