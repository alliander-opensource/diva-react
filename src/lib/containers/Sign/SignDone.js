import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import IconActionCheckCircle from 'material-ui/svg-icons/action/check-circle';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

class SignDone extends Component {
  renderAttributes = () => {
    const { attributes } = this.props;

    const rows = attributes.map(el => (
      <TableRow key={el.rawvalue + el.id}>
        <TableRowColumn>{el.rawvalue}</TableRowColumn>
        <TableRowColumn>{el.id}</TableRowColumn>
      </TableRow>
    ));

    return (
      <Table selectable={false} >
        <TableHeader displaySelectAll={false} >
          <TableRow>
            <TableHeaderColumn>Name:</TableHeaderColumn>
            <TableHeaderColumn>Value:</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} >
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
