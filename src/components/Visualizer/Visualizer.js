import React, { useState, useEffect, useRef } from "react";
import "./visualizer.css";
import MergeSort from "../Algorithms/MergeSort";
import QuickSort from "../Algorithms/QuickSort";
import InsertionSort from "../Algorithms/InsertionSort";
import BubbleSort from "../Algorithms/BubbleSort";

const ANIMATION_SPEED = 4;
const ARRAY_BAR_NUM = 200;
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
  const [seconds, setSeconds] = useState(0.0);
  const [isActive, setIsActive] = useState(false);

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
      value = randomIntFromInterval(10, 500);
      array.push(value);
    }
    setArray(array);
    setSortAlgo("-");
    setWorst("-");
    setAvg("-");
    setBest("-");
    setSeconds(0);
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
      <div className="container" id="info">
        <table className="table is-narrow">
          <th>Sorting Algorthim</th>
          <th>Worst Case Time Complexity</th>
          <th>Average Case Time Complexity</th>
          <th>Best Case Time Complexity</th>

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
      <nav className="navbar is-fixed-bottom">
        <div className="navbar-start">
          <a class="navbar-item" href="https://berlink2.github.io/Resume/">
            Contact Me
          </a>
        </div>
        <div className="navbar-end">
          <div class="navbar-item">
            <div className="buttons">
              <button class="button is-primary" onClick={mergeSort}>
                Merge Sort
              </button>
              <button class="button is-primary" onClick={quickSort}>
                Quick Sort
              </button>
              <button class="button is-primary" onClick={insertionSort}>
                Insertion Sort
              </button>
              <button class="button is-primary" onClick={bubbleSort}>
                Bubble Sort
              </button>
              <button class="button is-primary" onClick={resetArray}>
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
