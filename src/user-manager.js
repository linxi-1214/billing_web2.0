import React, { Component } from 'react';

class UserManagePills extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="offset-1"></div>
                <div className="col-2">
                    <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                         aria-orientation="vertical">
                        <a className="nav-link active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home"
                           role="tab" aria-controls="v-pills-home" aria-selected="true">Home</a>
                        <a className="nav-link" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile"
                           role="tab" aria-controls="v-pills-profile" aria-selected="false">Profile</a>
                        <a className="nav-link" id="v-pills-messages-tab" data-toggle="pill" href="#v-pills-messages"
                           role="tab" aria-controls="v-pills-messages" aria-selected="false">Messages</a>
                        <a className="nav-link" id="v-pills-settings-tab" data-toggle="pill" href="#v-pills-settings"
                           role="tab" aria-controls="v-pills-settings" aria-selected="false">Settings</a>
                    </div>
                </div>
                <div className="col-8">
                    <div className="tab-content" id="v-pills-tabContent">
                        <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel"
                             aria-labelledby="v-pills-home-tab">
                            <p>Cillum ad ut irure tempor velit nostrud occaecat ullamco aliqua anim Lorem sint. Veniam
                                sint duis incididunt do esse magna mollit excepteur laborum qui. Id id reprehenderit sit
                                est eu aliqua occaecat quis et velit excepteur laborum mollit dolore eiusmod. Ipsum
                                dolor in occaecat commodo et voluptate minim reprehenderit mollit pariatur. Deserunt non
                                laborum enim et cillum eu deserunt excepteur ea incididunt minim occaecat.</p>
                        </div>
                        <div className="tab-pane fade" id="v-pills-profile" role="tabpanel"
                             aria-labelledby="v-pills-profile-tab">
                            <p>Culpa dolor voluptate do laboris laboris irure reprehenderit id incididunt duis pariatur
                                mollit aute magna pariatur consectetur. Eu veniam duis non ut dolor deserunt commodo et
                                minim in quis laboris ipsum velit id veniam. Quis ut consectetur adipisicing officia
                                excepteur non sit. Ut et elit aliquip labore Lorem enim eu. Ullamco mollit occaecat
                                dolore ipsum id officia mollit qui esse anim eiusmod do sint minim consectetur qui.</p>
                        </div>
                        <div className="tab-pane fade" id="v-pills-messages" role="tabpanel"
                             aria-labelledby="v-pills-messages-tab">
                            <p>Fugiat id quis dolor culpa eiusmod anim velit excepteur proident dolor aute qui magna. Ad
                                proident laboris ullamco esse anim Lorem Lorem veniam quis Lorem irure occaecat velit
                                nostrud magna nulla. Velit et et proident Lorem do ea tempor officia dolor.
                                Reprehenderit Lorem aliquip labore est magna commodo est ea veniam consectetur.</p>
                        </div>
                        <div className="tab-pane fade" id="v-pills-settings" role="tabpanel"
                             aria-labelledby="v-pills-settings-tab">
                            <p>Eu dolore ea ullamco dolore Lorem id cupidatat excepteur reprehenderit consectetur elit
                                id dolor proident in cupidatat officia. Voluptate excepteur commodo labore nisi cillum
                                duis aliqua do. Aliqua amet qui mollit consectetur nulla mollit velit aliqua veniam nisi
                                id do Lorem deserunt amet. Culpa ullamco sit adipisicing labore officia magna elit nisi
                                in aute tempor commodo eiusmod.</p>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

export default UserManagePills;