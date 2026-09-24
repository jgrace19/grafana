import './Changelog.css';

interface Props {
  sanitizedHTML: string;
}

export const Changelog = ({ sanitizedHTML }: Props) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedHTML ?? 'No changelog was found' }}
      className="gf-plugin-changelog"
    ></div>
  );
};
