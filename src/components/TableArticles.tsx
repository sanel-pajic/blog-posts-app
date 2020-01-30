import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { CircularLoading } from "../components/CircularLoading";
import { ErrorLoading } from "./ErrorLoading";
import { IconButton, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { ARTICLES_QUERY } from "../queries/queries";
import { REMOVE_ARTICLE_MUTATION } from "../queries/mutations";

const TAX_RATE = 0.1;

const useStyles = makeStyles({
  table: {
    minWidth: 700,
    marginTop: "1%"
  }
});

function ccyFormat(num: number) {
  return `${num.toFixed(2)}`;
}

export const TableArticles: React.FC = () => {
  const classes = useStyles();
  const { data, loading } = useQuery(ARTICLES_QUERY, {
    fetchPolicy: "network-only"
  });

  const [removeComponentArticle, { error }] = useMutation(
    REMOVE_ARTICLE_MUTATION
  );
  if (loading || !data) {
    return <CircularLoading />;
  }
  if (error) {
    console.log("error", error);
    return <ErrorLoading />;
  }

  const invoiceSubtotal = data.componentArticles
    .map(
      (article: {
        _id: string;
        code: string;
        description: string;
        quantity: number;
        price: number;
      }) => article.price
    )
    .reduce((sum: number, i: number) => sum + i, 0);

  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="left">
              <Typography variant="h6">Code</Typography>
            </TableCell>
            <TableCell align="left">
              <Typography variant="h6">Description</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="h6">Quantity</Typography>
            </TableCell>
            <TableCell align="center">
              {" "}
              <Typography variant="h6">Price</Typography>
            </TableCell>
            <TableCell align="center">
              {" "}
              <Typography variant="h6">Sum Price (€) </Typography>
            </TableCell>
            <TableCell align="center">
              {" "}
              <Typography variant="h6">Action </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.componentArticles.map(
            (article: {
              _id: string;
              code: string;
              description: string;
              quantity: number;
              price: number;
            }) => (
              <TableRow key={article._id}>
                <TableCell>{article.code}</TableCell>
                <TableCell align="left">{article.description}</TableCell>
                <TableCell align="center">{article.quantity}</TableCell>
                <TableCell align="center">{ccyFormat(article.price)}</TableCell>
                <TableCell align="center">
                  {ccyFormat(article.price * article.quantity)}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() =>
                      removeComponentArticle({
                        variables: { _id: article._id },
                        refetchQueries: [{ query: ARTICLES_QUERY }]
                      })
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          )}
          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell rowSpan={3} />
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="center">{ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tax</TableCell>
            <TableCell align="center">{`${(TAX_RATE * 100).toFixed(
              0
            )} %`}</TableCell>
            <TableCell align="center">{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="center">{ccyFormat(invoiceTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
