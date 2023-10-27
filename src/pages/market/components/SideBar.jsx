import "../css/SideBar.css" ;

const SideBar = () => {
    return <>
        <div>
            <div className="sidebar-container">
                <div className="sidebar-container-grade">
                    <div className="sidebar-grade-content">
                        <a href="">노말</a>
                    </div>
                    <div className="sidebar-grade-content">
                        <a href="">레어</a>
                    </div>
                    <div className="sidebar-grade-content">
                        <a href="">슈퍼레어</a>
                    </div>
                    <div className="sidebar-grade-content">
                        <a href="">유니크</a>
                    </div>
                    <div className="sidebar-grade-content">
                        <a href="">레전드</a>
                    </div>
                </div>
                <div className="sidebar-container-grade">
                    <div className="sidebar-grade-content">
                        <a href="">가격 높은 순</a>
                    </div>
                    <div className="sidebar-grade-content">
                        <a href="">가격 낮은 순</a>
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default SideBar;