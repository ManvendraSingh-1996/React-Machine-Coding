/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

export const Accordion = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [openItems, setOpenItems] = useState<number[]>([]);
  const faqs = [
    {
      id: 1,
      question: "What is React?",
      answer: "React is a JavaScript library for building UI.",
    },
    {
      id: 2,
      question: "What is JSX?",
      answer: "JSX allows writing HTML-like syntax in JavaScript.",
    },
    {
      id: 3,
      question: "What is useState?",
      answer: "It is a React Hook used for state management.",
    },
  ];
  // this function is used to toggle the open state of an item in the accordion. If the item is already open, it will be closed, and if it is closed, it will be opened. The open state is managed using a single index of the open item.and it allows only one item to be open at a time.
  const handleClick = (index: number) => {
    setActiveIndex(index);
    if (activeIndex === index) {
      setActiveIndex(null);
    }
  };
  // this function is used to toggle the open state of an item in the accordion. If the item is already open, it will be closed, and if it is closed, it will be opened. The open state is managed using an array of indices of the open items. and it allows multiple items to be open at the same time.
  const handleClick2 = (index: number) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter((i) => i !== index));
    } else {
      setOpenItems((prev) => [...prev, index]);
    }
  };
  console.log(activeIndex);
  return (
    <div>
      {faqs.map((faq, index) => (
        <div
          key={faq.id}
          style={{
            border: "1px solid gray",
            marginBottom: "5px",
            padding: "5px",
          }}
        >
          <h3 style={{ cursor: "pointer" }} onClick={() => handleClick2(index)}>
            {faq.question}
          </h3>

          {activeIndex === index && <p>{faq.answer}</p>}
          {/* {openItems.includes(index) && <p>{faq.answer}</p>} */}
        </div>
      ))}
    </div>
  );
};
