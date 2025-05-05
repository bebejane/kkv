import { default as page, CourseProps } from '../page';

export default async function Course({ params }: CourseProps) {
	return page({ params, draft: true });
}
