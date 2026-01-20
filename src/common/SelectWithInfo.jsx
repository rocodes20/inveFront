import React, { useState, useEffect, useRef } from "react";

const SelectWithInfo = ({
    label,
    value,
    options = [],
    placeholder = "Select",
    onChange
}) => {
    const [open, setOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [clickedIndex, setClickedIndex] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
                setClickedIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options?.find(opt => opt.value === value);

    const handleIconClick = (e, index) => {
        e.stopPropagation();
        setClickedIndex(clickedIndex === index ? null : index);
    };

    return (
        <div className="field select-wrapper" ref={containerRef}>
            <label>{label}</label>

            <div className="custom-select" onClick={() => setOpen(!open)}>
                <span className={!value ? "placeholder-text" : ""}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className="arrow">{open ? "▴" : "▾"}</span>
            </div>

            {open && (
                <div className="dropdown">
                    {options.map((opt, index) => (
                        <div
                            key={opt.value}
                            className="dropdown-item"
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                                setClickedIndex(null);
                            }}
                        >
                            <span>{opt.label}</span>
                            
                            {opt.info && (
                                <span 
                                    className="info-icon"
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={(e) => handleIconClick(e, index)}
                                >
                                    ?
                                </span>
                            )}

                            {opt.info && (hoveredIndex === index || clickedIndex === index) && (
                                <div className="option-tooltip">
                                    {opt.info}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectWithInfo;