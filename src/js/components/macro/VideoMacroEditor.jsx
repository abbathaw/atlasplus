import React, {useEffect, useRef, useState} from 'react';
import * as ReactDOM from 'react-dom';
import Form, {HelperMessage, FormFooter, Field} from "@atlaskit/form";
import TextField from '@atlaskit/textfield';
import Select, {AsyncSelect} from '@atlaskit/select';
import "regenerator-runtime/runtime";

const VideoMacroEditor = () => {

  const [title, setTitle] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [video, setVideo] = useState("");
  const editorFormSubmitButtonEl = useRef(null);

  const submitForm = () => editorFormSubmitButtonEl.current.click();

  useEffect(() => {
    getMacroData();
    AP.dialog.getButton("submit").bind(submitForm);
  }, []);

  const getMacroData = () => {
    AP.confluence.getMacroData(({title, users, video}) => {
      console.log('MACRO DATA EDITOR_________>', title, users, video)
      setTitle(title);
      setAssignedUsers(JSON.parse(users));
      setVideo(JSON.parse(video));
    });
  }

  const saveMacro = (data) => {
    let macroParams = {
      title: data.title,
      users: JSON.stringify(data.users),
      video: JSON.stringify(data.video)
    };
    console.log("MACRO PARAMS________>", macroParams)
    AP.confluence.saveMacro(macroParams);
    AP.confluence.closeMacroEditor();
  }

  const userLookup = async (input) => {
    if (input.length > 2) {
      let searchedUsers;
      searchedUsers = await AP.request(`/rest/api/search?limit=6&cql=user.fullname~%22${input}%22`);
      searchedUsers = JSON.parse(searchedUsers.body).results;
      return searchedUsers.map(searchedUser => ({
        label: searchedUser.user.publicName,
        value: searchedUser.user.accountId
      }))
    }
  }

  const promiseOptions = input =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(userLookup(input));
      }, 1000);
    });

  return (
    <>
      <Form onSubmit={saveMacro}>
        {({formProps}) => (
          <form {...formProps}>
            <Field name="title" defaultValue={title} label="Video Title" isRequired>
              {({fieldProps}) => (
                <>
                  <TextField {...fieldProps} />
                  <HelperMessage>
                    Title to describe the video.
                  </HelperMessage>
                </>
              )}
            </Field>
            <Field name="users" defaultValue={assignedUsers} label="Assigned User(s)" isRequired>
              {({fieldProps}) => (
                <>
                  <AsyncSelect
                    {...fieldProps}
                    className="async-select-with-callback"
                    classNamePrefix="react-select"
                    loadOptions={promiseOptions}
                    placeholder="Select users"
                    isMulti
                  />
                  <HelperMessage>
                    Users assigned to view the video.
                  </HelperMessage>
                </>
              )}
            </Field>
            <Field name="video" defaultValue={video} label="Video"
                   isRequired>
              {({fieldProps}) => (
                <>
                  <Select
                    {...fieldProps}
                    className="single-select"
                    classNamePrefix="react-select"
                    options={[
                      {label: 'Learn Java Fundamentals', value: '1'},
                      {label: 'Java Design Patterns', value: '2'},
                      {label: 'OPP vs Functional Programming', value: '3'},
                      {label: 'SOLID Principles', value: '4'}
                    ]}
                    placeholder="Choose a Video"
                  />
                  <HelperMessage>
                    Select the video you would like to play.
                  </HelperMessage>
                </>
              )}
            </Field>
            <button hidden={true} type={"submit"} ref={editorFormSubmitButtonEl}/>
          </form>
        )}
      </Form>
    </>
  )
};

function render() {
  ReactDOM.render(
    <VideoMacroEditor/>,
    document.getElementById('video-macro-editor')
  );
}

if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
  render();
} else {
  window.addEventListener('DOMContentLoaded', render, false);
}
