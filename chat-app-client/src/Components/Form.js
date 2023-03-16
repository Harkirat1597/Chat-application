import React from 'react';

const Form = ({ children, className, ...rest }) => {
    return <form className={`${className}`} {...rest}>
        { children }
    </form>
}

Form.Input = React.forwardRef((props, ref) => {
    const { className, ...rest } = props;
    return <input className={`${className}`} ref={ref} {...rest} />
})

Form.Submit = ({ children, className, ...rest }) => {
    return <button className={`${className}`} {...rest}>
        { children } 
    </button>
}

export default Form;