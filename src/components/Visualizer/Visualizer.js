import React, { useState, useEffect, useRef } from "react";
import "./visualizer.css";
import MergeSort from "../Algorithms/MergeSort";
import QuickSort from "../Algorithms/QuickSort";
import InsertionSort from "../Algorithms/InsertionSort";
import BubbleSort from "../Algorithms/BubbleSort";

const windowWidth = window.innerWidth;
let ANIMATION_SPEED = 0;
let ARRAY_BAR_NUM = 0;
let ARRAY_BAR_HEIGHT = 400;

//switch case to change number of bars according to screen size
switch (true) {
  case windowWidth >= 1400: {
    ANIMATION_SPEED = 4;
    ARRAY_BAR_NUM = 200;
    break;
  }
  case windowWidth < 1250 && windowWidth > 1000:
    ANIMATION_SPEED = 4;
    ARRAY_BAR_NUM = 190;
    break;

  case windowWidth <= 1000 && windowWidth > 800: {
    ANIMATION_SPEED = 6;
    ARRAY_BAR_NUM = 150;
    break;
  }
  case windowWidth <= 800 && windowWidth > 650: {
    ANIMATION_SPEED = 10;
    ARRAY_BAR_NUM = 100;
    ARRAY_BAR_HEIGHT = 300;
    break;
  }
  case windowWidth <= 650 && windowWidth > 500: {
    ANIMATION_SPEED = 12;
    ARRAY_BAR_NUM = 75;
    ARRAY_BAR_HEIGHT = 250;
    break;
  }
  case windowWidth <= 500 && windowWidth > 420: {
    ANIMATION_SPEED = 20;
    ARRAY_BAR_NUM = 50;
    ARRAY_BAR_HEIGHT = 250;
    break;
  }
  case windowWidth <= 420 && windowWidth > 300: {
    ANIMATION_SPEED = 30;
    ARRAY_BAR_NUM = 40;
    ARRAY_BAR_HEIGHT = 250;
    break;
  }
  default:
    ANIMATION_SPEED = 4;
    ARRAY_BAR_NUM = 200;
}

const FINISHED_COLOR = "greenyellow";
const SORT_COLOR = "red";

export default () => {
  const [array, setArray] = useState([]);
  const [sortAlgo, setSortAlgo] = useState("-");
  const [worst, setWorst] = useState("-");
  const [avg, setAvg] = useState("-");
  const [best, setBest] = useState("-");
  const [isSorting, setIsSorting] = useState(false);
  const containerRef = useRef(null);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const barRef = useRef(null);

  //function that fills bar
  const fillBar = (totalTime) => {
    const bar = barRef.current;
    const interval = setInterval(() => {
      bar.value = bar.value + 0.1;

      if (bar.value >= 100) {
        clearInterval(interval);
      }
    }, totalTime / 1000);
  };

  //starts timer
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1.0);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  //hook that calls reset function that resets array when page loads
  useEffect(() => {
    resetArray();
  }, []);

  //method for logic of resetting array
  const resetArray = () => {
    const array = [];
    resetArrayColour();
    let value;
    for (let i = 0; i < ARRAY_BAR_NUM; i++) {
      value = randomIntFromInterval(15, ARRAY_BAR_HEIGHT);
      array.push(value);
    }
    setArray(array);
    setSortAlgo("-");
    setWorst("-");
    setAvg("-");
    setBest("-");
    setSeconds(0);
    barRef.current.value = 0;
  };

  //method that resets color of array
  const resetArrayColour = () => {
    const arrayBars = containerRef.current.children;
    for (let i = 0; i < array.length; i++) {
      const arrayBarStyle = arrayBars[i].style;
      arrayBarStyle.backgroundColor = "";
    }
  };

  //functions to call various sort algorithm implementations
  //and fills in sort algorithm info table
  const mergeSort = () => {
    setSortAlgo("Merge Sort");
    setWorst("O (n log(n))");
    setAvg("O (n log(n))");
    setBest("O (n log(n))");
    const animations = MergeSort(array);
    animateArrayUpdate(animations);
  };

  const quickSort = () => {
    setSortAlgo("Quick Sort");
    setWorst("O (n^2)");
    setAvg("O (n log(n))");
    setBest("O (n log(n))");
    const animations = QuickSort(array);
    animateArrayUpdate(animations);
  };

  const insertionSort = () => {
    setSortAlgo("Insertion Sort");
    setWorst("O (n^2)");
    setAvg("O (n^2)");
    setBest("O (n)");
    const animations = InsertionSort(array);
    animateArrayUpdate(animations);
  };

  const bubbleSort = () => {
    setSortAlgo("Bubble Sort");
    setWorst("O (n^2)");
    setAvg("O (n^2)");
    setBest("O (n)");
    const animations = BubbleSort(array);
    animateArrayUpdate(animations);
  };

  //function that starts sort animation
  const animateArrayUpdate = (animations) => {
    //calls function that fills bar and provides length of animation in ms
    fillBar(animations.length * ANIMATION_SPEED);

    setIsActive(true);
    if (isSorting) return;
    setIsSorting(true);
    animations.forEach(([comparison, swapped], index) => {
      setTimeout(() => {
        if (!swapped) {
          if (comparison.length === 2) {
            const [i, j] = comparison;
            animateArrayAccess(i);
            animateArrayAccess(j);
          } else {
            const [i] = comparison;
            animateArrayAccess(i);
          }
        } else {
          setArray((prevArr) => {
            const [k, newValue] = comparison;
            const newArr = [...prevArr];
            newArr[k] = newValue;
            return newArr;
          });
        }
      }, index * ANIMATION_SPEED);
    });

    setTimeout(() => {
      animateSortedArray();
    }, animations.length * ANIMATION_SPEED);
  };

  //function that animates array items that are being compared
  const animateArrayAccess = (index) => {
    const arrayBars = containerRef.current.children;
    const arrayBarStyle = arrayBars[index].style;
    setTimeout(() => {
      arrayBarStyle.backgroundColor = SORT_COLOR;
    }, ANIMATION_SPEED);
    setTimeout(() => {
      arrayBarStyle.backgroundColor = "";
    }, ANIMATION_SPEED * 2);
  };

  //function that animates final sorted array
  const animateSortedArray = () => {
    setIsActive(false);
    const arrayBars = containerRef.current.children;
    for (let i = 0; i < arrayBars.length; i++) {
      const arrayBarStyle = arrayBars[i].style;
      setTimeout(
        () => (arrayBarStyle.backgroundColor = FINISHED_COLOR),
        i * ANIMATION_SPEED
      );
    }
    setTimeout(() => {
      setIsSorting(false);
    }, arrayBars.length * ANIMATION_SPEED);
  };

  return (
    <>
      <div className="container">
        <div className="container info-container">
          <table className="table">
            <thead>
              <tr>
                <th>Sorting Algorthim</th>
                <th>Worst Case Time Complexity</th>
                <th>Average Case Time Complexity</th>
                <th>Best Case Time Complexity</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{sortAlgo}</td>
                <td>{worst}</td>
                <td>{avg}</td>
                <td>{best}</td>
              </tr>
            </tbody>
          </table>
          <div>
            <p>Time Elapsed: {seconds} seconds</p>
          </div>
          <div>
            <progress
              className="progress is-success"
              value="0"
              max="100"
              ref={barRef}
            ></progress>
          </div>
        </div>
        <div className="container array-container" ref={containerRef}>
          {array.map((value, i) => (
            <div
              className="array-bar"
              key={i}
              style={{ height: `${value}px` }}
            ></div>
          ))}
        </div>
      </div>
      <nav className="navbar is-fixed-bottom">
        <div className="navbar-start">
          <a className="navbar-item" href="https://berlink2.github.io/Resume/">
            Contact Me
          </a>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <button className="button is-primary" onClick={mergeSort}>
                Merge Sort
              </button>
              <button className="button is-primary" onClick={quickSort}>
                Quick Sort
              </button>
              <button className="button is-primary" onClick={insertionSort}>
                Insertion Sort
              </button>
              <button className="button is-primary" onClick={bubbleSort}>
                Bubble Sort
              </button>
              <button className="button is-primary" onClick={resetArray}>
                Reset Array
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
