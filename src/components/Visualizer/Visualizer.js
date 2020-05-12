import React, {useState, useEffect, useRef} from 'react';
import './visualizer.css';
import MergeSort from '../Algorithms/MergeSort';
import QuickSort from '../Algorithms/QuickSort';
import InsertionSort from '../Algorithms/InsertionSort';
import BubbleSort from '../Algorithms/BubbleSort';

const ANIMATION_SPEED =4;
const ARRAY_BAR_NUM = 200;
const FINISHED_COLOR = 'greenyellow';
const SORT_COLOR = 'red';

export default  () => {
    const [array, setArray] = useState([]);
    const [sortAlgo, setSortAlgo] = useState('-');
    const [worst, setWorst] = useState('-');
    const [avg, setAvg] = useState('-');
    const [best, setBest] = useState('-');
    const [isSorting, setIsSorting] = useState(false);
    const containerRef = useRef(null);

    useEffect(()=>{
        resetArray();
    },[]);

    const resetArray = () =>{

        const array = [];
        resetArrayColour();
        let value;
        for (let i =0;i<ARRAY_BAR_NUM; i++) {
            value = randomIntFromInterval(10,500);
            array.push(value);
        }
        setArray(array);
        setSortAlgo('-');
        setWorst('-');
        setAvg('-');
        setBest('-');
    }

      const mergeSort =()=> {
        setSortAlgo('Merge Sort');
        setWorst('O (n log(n))');
        setAvg('O (n log(n))');
        setBest('O (n log(n))');
        const animations = MergeSort(array);
        animateArrayUpdate(animations);
      }

      const quickSort =()=> {
        setSortAlgo('Quick Sort');
        setWorst('O (n^2)');
        setAvg('O (n log(n))');
        setBest('O (n log(n))');
        const animations = QuickSort(array);
        animateArrayUpdate(animations);
      }

      const insertionSort =()=> {
        setSortAlgo('Insertion Sort');
        setWorst('O (n^2)');
        setAvg('O (n^2)');
        setBest('O (n)');
        const animations = InsertionSort(array);
        animateArrayUpdate(animations);
      }

      const bubbleSort =()=> {
        setSortAlgo('Bubble Sort');
        setWorst('O (n^2)');
        setAvg('O (n^2)');
        setBest('O (n)');
        const animations = BubbleSort(array);
        animateArrayUpdate(animations);
      }

      const animateArrayUpdate = (animations)=> {
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
      }

      const animateArrayAccess=(index)=> {
        const arrayBars = containerRef.current.children;
        const arrayBarStyle = arrayBars[index].style;
        setTimeout(() => {
          arrayBarStyle.backgroundColor = SORT_COLOR;
        }, ANIMATION_SPEED);
        setTimeout(() => {
          arrayBarStyle.backgroundColor = '';
        }, ANIMATION_SPEED * 2);
      }

      const animateSortedArray =()=> {
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
      }

      const resetArrayColour=()=> {
        const arrayBars = containerRef.current.children;
        for (let i = 0; i < array.length; i++) {
          const arrayBarStyle = arrayBars[i].style;
          arrayBarStyle.backgroundColor = '';
        }
      }
    return (
        <>
<div className="container " id="info">
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

</div>
        <div className='array-container' ref={containerRef}>
        {array.map((value,i)=> (

            <div className="array-bar" key={i} 
   
            style={{height:`${value}px`}}>

            </div>
            
        ))}
        
        
        </div>
        <nav className="navbar is-fixed-bottom">
            <div className="navbar-start">
         <a class="navbar-item" href="https://berlink2.github.io/Resume/">Contact</a>
         </div>
            <div className="navbar">
                <div class="navbar-item">
                <div className="buttons">
        <button class="button is-primary" onClick={mergeSort}>Merge Sort</button>
        <button class="button is-primary" onClick={quickSort}>Quick Sort</button>
        <button class="button is-primary" onClick={insertionSort}>Insertion Sort</button>
        <button class="button is-primary" onClick={bubbleSort}>Bubble Sort</button>
        <button class="button is-primary" onClick={resetArray}>Reset Array</button>
        </div>
        </div>
        </div>
        
        </nav>
        </>
    )
}


function randomIntFromInterval(min, max) {


    return Math.floor(Math.random()*(max-min+1)+min);
}



