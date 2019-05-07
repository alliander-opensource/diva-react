import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';

import IconActionCheckCircle from '@material-ui/icons/CheckCircle';

import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';

class SignDone extends Component {
  renderAttributes = () => {
    const { attributes } = this.props;

    const rows = attributes.map(el => (
      <TableRow key={el.rawvalue + el.id}>
        <TableCell>{el.rawvalue}</TableCell>
        <TableCell>{el.id}</TableCell>
      </TableRow>
    ));

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name:</TableCell>
            <TableCell>Value:</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows}
        </TableBody>
      </Table>
    );
  }

  render() {
    return (
      <div id="sign-completed">
        <Row center="xs">
          <Col xs>
            <IconActionCheckCircle style={{ width: '100px', height: '100px', color: 'limegreen' }} />
          </Col>
        </Row>
        <Row center="xs">
          <Col xs={6}>
            Message signing successful!<br />
            <br />
            You signed the following message:<br />
            <b>{this.props.message}</b><br />
            <br />
            With the following attributes:
            {this.renderAttributes()}
            <br />
            {this.props.jwt // Show link to jwt.io if jwt was enabled, else display raw signature
              ? (
                <a
                  href={`https://jwt.io/#debugger-io?token=${this.props.jwt}`}
                  target="_blank"
                >
                  Click here to show the signature in jwt.io
                </a>
              ) : (
                JSON.stringify(this.props.signature)
              )
            }
          </Col>
        </Row>
      </div>
    );
  }
}

SignDone.propTypes = {
  attributes: PropTypes.arrayOf(PropTypes.object).isRequired,
  signature: PropTypes.arrayOf(PropTypes.object),
  message: PropTypes.string.isRequired,
  jwt: PropTypes.string,
};

export default SignDone;
