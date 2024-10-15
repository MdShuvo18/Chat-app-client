/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

const Input = ({
    label = '',
    name = '',
    type = 'text',
    placeholder = 'Type here',
    isRequired = 'true',
    value = '',  
    onChange = (e) => {e.preventDefault() }
}) => {
    return (
        <div className="w-full">
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">{label}</span>
                </div>
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    className="input input-bordered w-full max-w-xs"
                    required={isRequired}
                    value={value}
                    onChange={onChange}
                />
            </label>
        </div>
    );
};

export default Input;
