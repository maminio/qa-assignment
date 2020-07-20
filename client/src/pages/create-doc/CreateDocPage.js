import React, { Component } from 'react';
import { TextField, FormControl, Button, Input } from '@material-ui/core';
import styled from 'styled-components';
import { inject } from 'mobx-react';
import ErrorMessage from '../../components/ErrorMessage';
import {DropzoneArea} from 'material-ui-dropzone'

const FormWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormContainer = styled.div`
  max-width: 480px;
  width: 100%;
  background-color: #edf4ff;
  padding: 30px;
  border-radius: 5px;
`;

@inject('docsStore', 'routerStore')
class CreateDocage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      errorMessage: null,
      file: null,
    };
  }

  handleSubmitDoc = async () => {
    const { docsStore, routerStore } = this.props;
    const { title, description, file } = this.state;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file[0], file[0].name);
      await docsStore.createDoc(formData);
      routerStore.push('/docs');
    } catch (error) {
      const errorMessage = error.response.data.message;
      this.setState({ errorMessage });
    }
  };

  handleChange(file){
    this.setState({
      file
    });
  }

  render() {
    return (
      <FormWrapper>
        <FormContainer>
          <h1>Submit new document.</h1>
          <p>Provide information about the document you wish to textify.</p>

          { this.state.errorMessage && <ErrorMessage message={this.state.errorMessage} />}

          <FormControl fullWidth>
            <TextField
              label="Title"
              placeholder="Title"
              margin="normal"
              variant="outlined"
              onChange={e => this.setState({ title: e.target.value })}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              label="Description"
              placeholder="Description"
              multiline
              rows="8"
              margin="normal"
              variant="outlined"
              onChange={e => this.setState({ description: e.target.value })}
            />
          </FormControl>

          <FormControl fullWidth>
          <DropzoneArea
            onChange={this.handleChange.bind(this)}
            acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
            showPreviews={true}
            maxFileSize={5000000}
            />
          </FormControl>
          

          <Button
            style={{ marginTop: '10px' }}
            fullWidth
            variant="contained"
            color="primary"
            onClick={this.handleSubmitDoc}
          >
            SUBMIT
          </Button>
        </FormContainer>
      </FormWrapper>
    );
  }
}

export default CreateDocage;
