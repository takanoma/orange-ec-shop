import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// styleは別関数として定義する（関数の中で定義しない）
const useStyles = makeStyles((theme) => ({
    formControl: {
        marginBottom: 16,  // 下に16px追加（価格フィールドが16px下がる）
        minWidth: 120,
        width: "100%"
    }
}));

const SelectBox = (props) => {

    const classes = useStyles();

    return (
        <FormControl className={classes.formControl}>
            <InputLabel>{props.label}</InputLabel>
            <Select
                value={props.value} required={props.required}
                onChange={(e) => props.select(e.target.value)}
            >
                {props.options.map((value) => {
                    /* keyは常に一意な値として設定してあげる */
                    return <MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>
                })}
            </Select>
        </FormControl>
    )

}

export default SelectBox