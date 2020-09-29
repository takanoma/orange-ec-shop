import React, {useCallback, useState, useEffect} from 'react';
import IconButton from "@material-ui/core/IconButton";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import {TextInput} from "../UIkit";

const useStyles = makeStyles({
    checkIcon: {
        float: "right"
    },
    iconCell: {
        height: 48,
        width: 48
    }
})

const SetSizesArea = (props) => {
    const classes = useStyles();

    const [index, setIndex] = useState(0),
          [size, setSize] = useState(""),
          [quantity, setQuantity] = useState(0);

    const inputSize = useCallback((event) => {
        setSize(event.target.value)
    }, [setSize])

    const inputQuantity = useCallback((event) => {
        setQuantity(event.target.value)
    }, [setQuantity])

    const addSize = (index, size, quantity) => {
        if (size === "" || quantity === "") {
            // required
            return false;
        }
        // indexとサイズの長さが一致している時は追加
        if (index === props.sizes.length) {
            // 現在のサイズオブジェクトを追加し、追加が終わったら初期化する
            props.setSizes(prevSize => [...prevSize, {size: size, quantity: quantity}])
            setIndex(index + 1)
            setSize("")
            setQuantity("")
        } else {
            const newSizes = props.sizes
            newSizes[index] = {size: size, quantity: quantity}
            props.setSizes(newSizes)
            setIndex(newSizes.length + 1)
            setSize("")
            setQuantity("")
        }

    }

    const editSize = (index, size, quantity) => {
        setIndex(index)
        setSize(size)
        setQuantity(quantity)
    }

    const deleteSize = (deleteIndex) => {
        const newSizes = props.sizes.filter((item, i) => i !== deleteIndex);
        props.setSizes(newSizes)

    }

    // 初期表示されたときに、その時のindexの長さを設定する
    useEffect(() => {
        setIndex(props.sizes.length)
    },[props.sizes.length])


    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>サイズ</TableCell>
                            <TableCell>数量</TableCell>
                            <TableCell className={classes.iconCell} />
                            <TableCell className={classes.iconCell} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.sizes.length > 0 && (
                            props.sizes.map((item, i) => (
                                <TableRow key={item.size} >
                                    <TableCell>{item.size}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>
                                        <IconButton className={classes.iconCell} onClick={() => editSize(i, item.size, item.quantity)}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton className={classes.iconCell} onClick={() => deleteSize(i)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <div>
                    <TextInput
                        fullwidth={false} label={"サイズ"} multilize={false} required={true}
                        onChange={inputSize} rows={1} value={size} type={"text"}
                    />
                    <TextInput
                        fullwidth={false} label={"数量"} multilize={false} required={true}
                        onChange={inputQuantity} rows={1} value={quantity} type={"number"}
                    />
                    <IconButton className={classes.checkIcon} onClick={() => addSize(index, size, quantity)}>
                        <CheckCircleIcon />
                    </IconButton>
                </div>

            </TableContainer>
        </div>
    )
}

export default SetSizesArea