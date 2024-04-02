import './BookCreationView.scss';

export function BookCreationView() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  };

  return (
    <div className={'book-creation-view'}>
      <h1>Book Creation</h1>
      <form onSubmit={handleSubmit}>
        <div className={'form-container id'}>
          <label htmlFor="id">ID</label>
          <input type="text" id="id" name="id" required placeholder={''} />
        </div>
        <div className={'form-container title'}>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" required />
        </div>

        <div className={'form-container resume'}>
          <label htmlFor="resume">Resume</label>
          <textarea id="resume" name="resume" />
        </div>

        <div className={'form-container cover'}>
          <label htmlFor="cover">Cover</label>
          <input type="file" id="cover" name="cover" disabled />
        </div>
        <div className={'tags'}>
          Tags :
          <div className={'tag-list'}>
            <span className={'tag'}>Tag 1</span>
            <span className={'tag'}>Tag 2</span>
            <span className={'tag'}>Tag 3</span>
          </div>
          <div className={'form-container tags'}>
            <input type="text" name="tags" />
            <button type="button">Add</button>
          </div>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
