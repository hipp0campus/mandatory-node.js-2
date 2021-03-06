import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  margin: 6px 12px;
  border-radius: 4px;

  .default-footer {
    font-size: 14px;
    flex: 1;

    :hover {
      cursor: pointer;
      background-color: #e4e7eb;
    }
  }

  // -----------------------------------------------------------------------------------

  .textfield {
    position: relative;
    margin: 4px 0px;
  }

  label {
    position: absolute;
    left: 12px;
    top: 22px;
    pointer-events:none;
    font-size: 14px;
    color: #626262;
    transition: 0.2s ease all;
  }

  .border-top-left, .border-top-right {
    position: absolute;
    height: 1px;
    bottom: -1px;
    width: 0%;
    background-color: #6200ee;
    transition: 0.2s ease width;
  }

  .border-top-left {
    right: 50%;
  }

  .border-top-right {
    left: 50%;
  }

  .border-bottom {
    position: absolute;
    height: 1px;
    width: 100%;
    background-color: #8e8e8e;
  }

  input {
    padding: 26px 12px 12px 12px;
    width: 256px;
    background-color: #f1f3f5;
    border: none;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    font-size: 16px;
    transition: 0.15s ease background-color;
    color: #373737;

    :hover {
      background-color: #e8e8e8;
      cursor: pointer;
    }

    :focus {
      outline: none;
      cursor: text;
    }

    :focus ~ .border-top-right, 
    :focus ~ .border-top-left {
      background-color: #6200ee;
      border-top: 1px solid #6200ee;
      width: 50%;
      z-index: 1;
    }

    :focus ~ label,
    :valid ~ label {
      top: 10px;
      font-size: 12px;
    }

    :focus ~ label {
      color: #6200ee;
    }
  }

  p {
    font-size: 14px;
    padding-bottom: 12px;
    color: rgb(125, 125, 125);
    text-align: center;
  }

  input[type=number]::-webkit-inner-spin-button {
    opacity: 0;
  }

  input[type=submit] {
    margin: 32px auto 0px auto;
  
    text-transform: uppercase;
    letter-spacing: 0.05rem;
    font-size: .875rem;
    color: #6200ee;
    cursor: pointer;
    padding: 0.2rem 0.6rem;
    display: block;
    background-color: #fff;
    border: 1px solid #6200ee;
    border-radius: 4px;
    :hover,
    :focus {
      background-color: rgba(98, 0, 238, 0.05);
    }
  }
`;

export default function Footer({ workoutID, workouts, setWorkouts }) {
  const [exercise, setExercise] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const formReference = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  function onSubmit(e) {
    e.preventDefault();

    axios.post(`/workouts/exercises/add/${workoutID}`, { 
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight
     })
    .then(response => {
      let workoutsCopy = [...workouts];

      let workoutIndex = workoutsCopy.findIndex(workout => workout._id === response.data._id);
      workoutsCopy.splice(workoutIndex, 1, response.data);

      setWorkouts(workoutsCopy);
    })
    .catch(err => {
      console.log(err);
    })

    setExercise({});
  }
  
  function onChange(e) {
    setExercise({...exercise, ...{[e.target.name]: e.target.value} });
  }
  
  function handleClickOutside(e) {
    if (formReference.current.contains(e.target)) {
      return setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }
  
  let display = null;
  let hide = null;
  if (isVisible) {
    display = { display: 'block' };
    hide = { display: 'none' };
  } else {
    display = { display: 'none' };
    hide = { display: 'block' };
  };

  return (
    <Container ref={formReference} className="ignore-scroll-drag">
      <span style={hide} className={`default-footer`}>+ Add new exercise</span>
      {isVisible && (
      <div className={`add-exercise`} style={display}>
        <form onSubmit={onSubmit}>
          <div className="textfield">
            <input 
              type="text" 
              name="name" 
              value={exercise.name || ''} 
              onChange={onChange}
              required
            />
            <label>exercise name</label>
            <div className="border-top-left"></div>
            <div className="border-top-right"></div>
            <div className="border-bottom"></div>
          </div>
          <div className="textfield">
            <input
              type="number" 
              name="sets" 
              value={exercise.sets || ''} 
              onChange={onChange}
              required
            />
            <label>sets</label>
            <div className="border-top-left"></div>
            <div className="border-top-right"></div>
            <div className="border-bottom"></div>
          </div>
          <div className="textfield">
            <input
              type="number" 
              name="reps" 
              value={exercise.reps || ''} 
              onChange={onChange}
              required
            />
            <label>reps</label>
            <div className="border-top-left"></div>
            <div className="border-top-right"></div>
            <div className="border-bottom"></div>
          </div>
          <div className="textfield">
            <input 
              type="number" 
              name="weight" 
              value={exercise.weight || ''} 
              onChange={onChange}
              required
            />
            <label>weight</label>
            <div className="border-top-left"></div>
            <div className="border-top-right"></div>
            <div className="border-bottom"></div>
          </div>
          <input 
            type="submit" 
            onSubmit={(e) => onSubmit(e)}
          />
        </form>
      </div>)}
    </Container>
  )
}