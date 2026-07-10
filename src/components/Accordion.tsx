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

  const handleClick = (index: number) => {
    setActiveIndex(index);
    if (activeIndex === index) {
      setActiveIndex(null);
    }
  };
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
